import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import useShowtoast from "../../hooks/useShowtoast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import PostsAtom from "../../atoms/PostsAtom";
import Actions2 from "../actions/Actions2";

const UserPost = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowtoast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(PostsAtom);
  const navigate = useNavigate();

  // Fetch user profile based on postedBy prop
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/getUserProfile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };
    getUser();
  }, [postedBy, showToast]);

  // Delete post handler
  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id)); // Remove deleted post from state
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user) return null;

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex mb={4} py={5} gap={2}>
        <Flex flexDirection={"column"} alignItems={"center"} padding={"2px"}>
          <Avatar size={"md"} name={user?.name} src={user?.profilePic} />
          <Box w="1px" h={"full"} bg={"gray.light"}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies.slice(0, 3).map((reply, index) => (
              <Avatar
                key={index}
                size="xs"
                name={reply.username}
                src={reply.profilePic}
                position={"absolute"}
                top={index === 0 ? "0px" : "auto"}
                bottom={index > 0 ? "0px" : "auto"}
                left={index === 0 ? "15px" : index === 2 ? "4px" : "auto"}
                right={index === 1 ? "-5px" : "auto"}
                padding={"2px"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${reply.username}`);
                }}
              />
            ))}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            >
              {user?.name}
            </Text>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={{ base: "sm", md: "xs", sm: "xs" }} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === user._id && (
                <DeleteIcon size={20} onClick={handleDeletePost} />
              )}
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text fontSize={"sm"} overflowWrap={'break-word'} width={'full'}>
            {post.text}
          </Text>
          {post.img && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
              <Image
                src={post.img}
                w={"full"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}/post/${post._id}`);
                }}
              />
            </Box>
          )}
          <Actions2 post={post} updatePosts={setPosts} />
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;
