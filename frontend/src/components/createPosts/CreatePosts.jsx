import { Box, Button, CloseButton, Flex, FormControl, Image, Text, Textarea } from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs";

import React, { useCallback, useRef, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";


import { useColorModeValue, useDisclosure } from "@chakra-ui/react";
import useImageDisplay from "../../hooks/useImageDisplay";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowtoast from "../../hooks/useShowtoast";
import PostsAtom from "../../atoms/PostsAtom";
import { useParams } from "react-router-dom";
const MAX_CHAR = 500;

const CreatePosts = () => {
    const showToast=useShowtoast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const fileRef = useRef(null);
  const[posts,setPosts]=useRecoilState(PostsAtom)
  const { handleImageChange, imgUrl,setImgUrl} = useImageDisplay();
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const[loading,setLoading]=useState(false)
  const user=useRecoilValue(userAtom)
  const { username } = useParams();
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };
  // useCallback(()=>{})
    const handleCreatePost = useCallback(async () => {
      setLoading(true);
      try {
          const res = await fetch("/api/posts/create", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
          });
          const data = await res.json();
          if (data.error) {
              showToast("Error", data.error, "error");
              return;
          }
          showToast("Success", "Post created successfully", "success");
          if (username === user.username) {
            setPosts((prevPosts) => [data, ...prevPosts]);
          }
          onClose();
          setPostText("");
          setImgUrl("");
      } catch (error) {
          showToast("Error", error.message || "Something went wrong", "error");
      } finally {
          setLoading(false);
      }
    }, [postText, imgUrl, user._id, showToast, setPosts, onClose, setImgUrl]);

  
  return (
    <Box>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.400", "gray.dark")}
        onClick={onOpen}
      >
        <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Textarea
                placeholder="Type Something..."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
                color={"gray.400"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <input
                type="file"
                hidden
                ref={fileRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => fileRef.current.click()}
              />
            </FormControl>

            {imgUrl&&(
                <Flex mt={5} position={'relative'}>
                    <Image src={imgUrl} alt="Seleected img" w={"full"} h={'full'}/>

            <CloseButton onClick={()=>setImgUrl(null)}/></Flex>
           
           
        )}
        </ModalBody>    
                    <ModalFooter>
            <Button variant="ghost" onClick={handleCreatePost} border={'solid 2px gray'}> Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreatePosts;
