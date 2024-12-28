import { Avatar, Box, Divider, Flex, Text,useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions2 from "./actions/Actions2";
// import Actions from "./actions/Actions";

const Comments = ({reply,lastreply,post}) => {
    const[liked,setLiked]=useState(false)
    const {colorMode}=useColorMode()
  return (
    <>
    <Flex gap={3} py={2} my={2} >
        <Box>

      <Avatar src={reply.profilepic} size={"xs"}  />
        </Box>
      <Flex gap={1} w={"full"} flexDirection={"column"} >
        <Flex w={"full"} justifyContent={"space-between"}  >
          <Text fontSize={{ base: "xs", md: "sm", lg: "md" }}>{reply.username}</Text>
          <Flex gap={3} alignItems={"center"}>
            {/* <Text fontSize={{ base: "xs", md: "sm", lg: "md" }}>{createdAt}</Text> */}
            <BsThreeDots />
          </Flex>
        </Flex>
        <Text>{reply.text}</Text>
        {/* {reply.replies?.map((nestedReply) => (
          <Comments
          key={nestedReply._id}
          reply={nestedReply} // Pass the nested reply
          lastReply={nestedReply._id === reply.replies[reply.replies.length - 1]._id}
          />))} */}
          <Actions2 post={post} Reply={reply}/>
        <Text
          fontSize={{ base: "xs", md: "sm", lg: "md" }}
          color={"gray.light"}
          >
          {/* {likes + (liked ? 1 : 0)}  */}
        </Text>
      </Flex>
    </Flex>
    <Divider my={4} borderColor={colorMode==='light'?"gray.dark":"gray.light"}/>
            </>
  );
};

export default Comments;
