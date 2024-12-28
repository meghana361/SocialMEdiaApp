import {
    Box,
    Button,
    Flex,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
  } from "@chakra-ui/react";
  import { useCallback, useEffect, useState } from "react";
  import PostsAtom from "../../atoms/PostsAtom";
  import useShowtoast from "../../hooks/useShowtoast";
  import { useRecoilState, useRecoilValue } from "recoil";

  import userAtom from "../../atoms/userAtom";
  import { useNavigate } from "react-router-dom";
  
  const Actions2 = ({ post ,Reply,updatePosts}) => {
    const user = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(PostsAtom);
    const [isLiking, setIsLiking] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState("");
    const [animate, setAnimate] = useState(false);
    const showToast = useShowtoast();
    const [showComments, setShowComments] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [liked, setLiked] = useState(null);
    const [nestedReplies, setNestedReplies] = useState({});
    const [fetchlikelength,setFetchlikelength]=useState()
    console.log("Post object actions2: ", post);
  useEffect(() => {
      if (post && user) {
        setLiked(post?.likes?.includes(user._id));
        // setFetchlikelength(post?.likes?.length)
      }
    }, [post, user]);
 
    const handleAnimation = () => {
      setAnimate(true);
      // Remove the animation class after it completes (300ms for this example)
      setTimeout(() => {
        setAnimate(false);
      }, 300);
    };
  
    const handlelike =useCallback( async () => {
      if (!user)
        return showToast(
          "Error",
          "You must be logged in to like a post",
          "error"
        );
      if (isLiking) return;
      setIsLiking(true);
      try {
        const res = await fetch("/api/posts/likeunlike/" + post._id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");
        // if(!liked){
        // 	const updatelikeinpost=posts.map((p)=>{
        // 		if(p._id===post._id){
        // 			return {...p,likes:[...p.likes,user._id]}
        // 		}
        // 		return p;
        // 	});
        // 	setPosts(updatelikeinpost)
        // }else{
        // 	const updatelikesinpost=posts.map((p)=>{
        // 		if(p._id===post._id){
        // 			return {...p,likes:p.likes.filter((id)=>id!==user._id)}
        // 		}
        // 		return p;
        // 	});
        // setPosts(updatelikesinpost)
        // setLiked(!liked);
        // }
        setPosts((prevPosts) => {
            return prevPosts.map((p) =>
              p._id === post._id
                ? {
                    ...p,
                    likes: liked
                      ? p.likes.filter((id) => id !== user._id)
                      : [...p.likes, user._id],
                  }
                : p
            );
          });
        //   updatePosts(posts)
        setLiked(!liked);
  
        // Trigger the pop animation
        handleAnimation();
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLiking(false);
      }
    },[user, isLiking, post, posts, liked, setPosts, showToast, handleAnimation])


    const handleReply = useCallback( async () => {
      if (!user)
        return showToast(
          "Error",
          "You must be logged in to reply to a post",
          "error"
        );
      if (isReplying) return;
      setIsReplying(true);
      try {
        const res = await fetch("/api/posts/reply/" + post._id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: reply }),
        });
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");
        const updatreplyinpost = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, replies: [...p.replies, data] };
          }
          return p;
        });
        setPosts(updatreplyinpost);
        // setPosts((prevPosts) => {
        //     return prevPosts.map((p) =>
        //       p._id === post._id
        //         ? {
        //             ...p,
        //             replies: p.replies.map((reply) =>
        //               reply._id === replyId
        //                 ? { ...reply, replies: [...reply.replies, data] }
        //                 : reply
        //             ),
        //           }
        //         : p
        //     );
        //   });
        showToast("Success", "Reply posted successfully", "success");
        onClose();
        setReply("");
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsReplying(false);
      }
    },[user, isReplying, post, reply, posts, setPosts, showToast, onClose])
  const handleToggleComments=(e)=>{
      e.preventDefault()
  setShowComments((prev)=>!prev)
  }
  const navigate=useNavigate()



  const handleNestedReplyChange = (replyId, value) => {
    setNestedReplies((prev) => ({
      ...prev,
      [replyId]: value,
    }));//  onChange={(e)=>setInputs({...inputs,password:e.target.value})} same like this but replies is array so like that
  };
  
  
  const handleAddNestedReply = async (replyId) => {
    if (!user) return showToast("Error", "You must be logged in to reply", "error");

    const text = nestedReplies[replyId];//a[i]
    if (!text) return; // Don't submit empty replies

    try {
      const res = await fetch(`/api/posts/${post._id}/reply/${replyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          username: user.username, // Ensure username is passed correctly
          userProfilePic: user.profilePic, // Replace with actual path if necessary
          text,

        }),
      });
      if (!res.ok) {
        const errorText = await res.text(); // Get the error message in text form
        console.error("Error response:", errorText); // Log the error for debugging
        return showToast("Error", "Failed to post reply. Please try again.", "error");
      }
      

      const data = await res.json();
      if (data.error) 
        {return showToast("Error", data.error, "error");



        }

      // Update posts state with the new nested reply
      const updatedPosts = posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              replies: p.replies.map((reply) =>
                reply._id === replyId
                  ? { ...reply, replies: [...reply.replies, data] }
                  : reply
              ),
            }
          : p
      );
      setPosts(updatedPosts);
      setNestedReplies((prev) => ({ ...prev, [replyId]: "" })); // Clear input for this reply
      showToast("Success", "Nested reply posted successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

    return (
      <Flex flexDirection="column">
        <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
          <svg
            aria-label="Like"
            color={liked ? "#f15b5b" : ""}
            fill={liked ? "#f15b5b" : "transparent"}
            height="19"
            role="img"
            viewBox="0 0 24 22"
            width="20"
            onClick={handlelike}
            className={`like ${animate ? "pop" : ""}`}
          >
            <path
              d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
              stroke="currentColor"
              strokeWidth="2"
            ></path>
          </svg>
  
          <svg
            aria-label="Comment"
            color=""
            fill=""
            height="20"
            role="img"
            viewBox="0 0 24 24"
            width="20"
            onClick={onOpen}
          >
            <title>Comment</title>
            <path
              d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
  
          <RepostSVG />
          <ShareSVG />
        </Flex>
  {showComments&&(
      <Box mt={4}>
   <Text fontWeight="bold">Comments:</Text>
   {post?.replies?.map((reply,index)=>(
      <Box key={index} mb={2} borderWidth="1px" borderRadius="md" p={2} borderColor={'gray.500'}>
            <Text fontSize="sm" color="gray.light">{reply.username}</Text>	
            <Text>{reply.text}</Text>
            <FormControl>
                <Input
                  placeholder="Add a nested reply"
                  value={nestedReplies[reply._id] || ""}
                  onChange={(e) => handleNestedReplyChange(reply._id, e.target.value)}//const handleNestedReplyChange = (replyId, value) => {
                    // setNestedReplies((prev) => ({
                    //   ...prev,
                    //   [replyId]: value,
                    // }));
                />
                 <Button
                  mt={2}
                  onClick={() => handleAddNestedReply(reply._id)}
                >
                  Reply
                </Button>
              </FormControl>
              {reply.replies && reply.replies.length > 0 && (
                <Box mt={2} pl={4}>
                  {reply.replies.map((nestedReply,nestedIndex) => (
                    <Box key={nestedIndex} mb={2} borderWidth="1px" borderRadius="md" p={2} borderColor={'gray.400'}>
                      <Text fontSize="sm" color="gray.light">{nestedReply.username}</Text>
                      <Text>{nestedReply.text}</Text>
                    </Box>
                  ))}
                </Box>

  )}
            </Box>
          ))}
        </Box>
      )}
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"} fontSize="sm">
            {post?.likes?.length || 0} likes
            
          </Text>
          <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
          <Text color={"gray.light"} fontSize="sm" onClick={handleToggleComments} cursor={'pointer'}>
            {post?.replies?.length ||0} comments
          </Text>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <Input
                  placeholder="Reply goes here.."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
              </FormControl>
            </ModalBody>
  
            <ModalFooter>
              <Button
                colorScheme="blue"
                size={"sm"}
                mr={3}
                isLoading={isReplying}
                onClick={handleReply}
              >
                Reply
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    );
  };
  
  export default Actions2;
  
  const RepostSVG = () => {
    return (
      <svg
        aria-label="Repost"
        color="currentColor"
        fill="currentColor"
        height="20"
        role="img"
        viewBox="0 0 24 24"
        width="20"
      >
        <title>Repost</title>
        <path
          fill=""
          d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
        ></path>
      </svg>
    );
  };
  
  const ShareSVG = () => {
    return (
      <svg
        aria-label="Share"
        color=""
        fill="rgb(243, 245, 247)"
        height="20"
        role="img"
        viewBox="0 0 24 24"
        width="20"
      >
        <title>Share</title>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
          x1="22"
          x2="9.218"
          y1="3"
          y2="10.083"
        ></line>
        <polygon
          fill="none"
          points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        ></polygon>
      </svg>
    );
  };
  