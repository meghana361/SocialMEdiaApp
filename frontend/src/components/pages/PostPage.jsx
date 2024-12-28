import { Avatar, Box, Divider, Flex, Image, Text,useColorMode } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
// import Actions from "../actions/Actions";
import Comments from "../Comments";
import useShowtoast from "../../hooks/useShowtoast";
import { useRecoilState, useRecoilValue } from "recoil";
import PostsAtom from "../../atoms/PostsAtom";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import userAtom from "../../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import Actions2 from "../actions/Actions2";
import singlePost from "../../atoms/singlePost";
const PostPage = () => {
  
  const { user, loading } = useGetUserProfile();
	const [posts, setPosts] = useRecoilState(PostsAtom);
	const showToast = useShowtoast();
	const { pid } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(null);
  console.log("user postpage",user);
  
    const[liked,setLiked]=useState(false)
    const{colorMode}=useColorMode()
  
    useEffect(() => {
      const getPost = async () => {
        setPosts([]);
        try {
          const res = await fetch(`/api/posts/${pid}`);
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          setPosts([data]);
          setCurrentPost(data); 
        } catch (error) {
          showToast("Error", error.message, "error");
        }
      };
      getPost();
    }, [showToast, pid, setPosts,currentPost]);
    if (loading || !currentPost) {
      return <Text>Loading...</Text>; // Show loading text or spinner
    }
    const handleDeletePost = async () => {
      try {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
  
        const res = await fetch(`/api/posts/${currentPost._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        showToast("Success", "Post deleted", "success");
        setPosts(posts.filter((p) => p._id !== currentPost._id)); 
        navigate(`/${user.username}`);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    if (!currentPost) return null;
	console.log("currentPost", currentPost);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={"3"}>
          <Avatar
            src={user.profilePic}
            size={{ base: "md", md: "lg", lg: "xl" }}
            name={user.name}
          />  
         
            <Text
              fontSize={{ base: "xs", md: "sm", lg: "md" }}
              fontWeight={"bold"}
              // _hover={{
                //     fontFamily:"fantasy"
                // }}
                cursor={"pointer"}
                // onClick={}
                >
           	{user.username}
            </Text>
           
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={{ base: "xs", md: "sm", lg: "md" }}
            color={"gray.light"}
          >
           {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
						<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
					)}
        </Flex>
      </Flex>
      <Text fontSize={{ base: "xs", md: "sm", lg: "md" }} my={3}> {currentPost.text}</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"solid 1px"}
        borderColor={"gray.light"}
      >
       {currentPost.img && (
				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
					<Image src={currentPost.img} w={"full"} />
				</Box>
			)}
      
      </Box>
      <Flex gap={3} mt={3} my={4}  >
        <Actions2 post={currentPost}/>
      </Flex>
      <Flex gap={3} mt={1} my={2} alignItems={'center'}>
<Text color={"gray.light"} fontSize={{ base: "xs", md: "sm", lg: "md" }}> likes </Text>
<Box borderRadius={"full"} color={'gray.light'} w="4px" h={'4px'} bg={'gray.light'}></Box>
<Text color={"gray.light"} fontSize={{ base: "xs", md: "sm", lg: "md" }}> replies</Text>

      </Flex>
      <Divider my={4} color={colorMode==='light'?"gray.dark":"gray.light"}/>
      {/* {currentPost.replies.map((reply) => (
				<Comments
					key={reply._id}
					reply={reply}
					lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
          post={currentPost}
				/>
			))} */}
    </>
  );
};

export default PostPage;
