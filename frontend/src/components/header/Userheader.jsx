// import {
//   Avatar,
//   Box,
//   Button,
//   Flex,
//   Link,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuList,
//   Text,
//   VStack,
//   useColorMode,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { Link as RouterLink } from "react-router-dom";
// import React from "react";
// import { FaInstagram } from "react-icons/fa";
// import { CgMoreO } from "react-icons/cg";
// import { useToast } from "@chakra-ui/react";
// import { useRecoilValue } from "recoil";
// import userAtom from "../../atoms/userAtom";
// import useFollowUnfollow from "../../hooks/useFollowUnfollow";

// const Userheader = ({ user }) => {
//   const {handleFollowUnfollow,following,updating,followerCount}=useFollowUnfollow(user)
//   const toastIdRef = React.useRef();
//   const currentUser = useRecoilValue(userAtom);
//   const toast = useToast();
  
//   const copyUrl = () => {
//     const url = window.location.href;
//     navigator.clipboard.writeText(url).then(() => {
//       toastIdRef.current = toast({ description: "Profile link copied" });
//     });
//   };
//   const { colorMode, toggleColorMode } = useColorMode();
//   return (
//     <VStack justifyContent={"center"} gap={"20px"} alignItems={"self-start"}>
//       <Flex justifyContent={"space-between"} w={"full"}>
//         {/* <Box style={{border:"solid 2px"}}> */}
//         <Box>
//           <Text fontSize={"larger"} fontWeight={"hairline"} mt={3}>
//             {user.name}
//           </Text>
//           <Flex gap={2} alignItems={"center"} mt={3}>
//             <Text
//               fontFamily={"sans-serif"}
//               fontSize={{ base: "xs", md: "sm", lg: "md" }}
//             >
//               {" "}
//               {user.username}
//             </Text>
//             <Text
//               fontSize={{ base: "xs", md: "sm", lg: "md" }}
//               bg={useColorModeValue("gray.300",'gray.900')}
//               color={"gray.light"}
//               p={"1"}
//               borderRadius={"full"}
//             >
//               {" "}
//               momento.net
//             </Text>
//           </Flex>
//         </Box>
//         <Box>
//           {user.profilePic && (
//             <Avatar
//               name={user.name}
//               src={user.profilePic}
//               size={{ base: "md", md: "lg" }}
//             />
//           )}
//           {!user.profilePic && (
//             <Avatar
//               name={user.name}
//               src="https://bit.ly/broken-link"
//               size={{ base: "md", md: "lg" }}
//             />
//           )}
//         </Box>
//       </Flex>
//       <Text
//         fontSize={{ base: "l", md: "md" }}
//         fontWeight={"hairline"}
//         fontFamily={"heading"}
//       >
//         {user.bio}
//       </Text>
//       {currentUser?._id===user._id && (
//         <Link as={RouterLink} to={"/update"}>
//           <Button size={'sm'}>update Profile</Button>
//         </Link>
//       )}
//       {currentUser?._id!==user._id && (
//         <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
//           {following?"Unfollow":"Follow"}

//         </Button>
//       )}
//       <Flex w={"full"} justifyContent={"space-between"}>
//         <Flex gap={2} alignItems={"center"} flexDirection={'column'}>
//           <Text color={"gray.light"}> followers</Text>
//           <Text color={"gray.light"}>{followerCount}</Text>
//         </Flex>

//           <Box w={2} h={2} bg={"gray.light"} borderRadius={"full"} mt={3}></Box>
//           <Flex gap={2} alignItems={"center"} flexDirection={'column'}>
//           <Text color={"gray.light"}>following</Text>
//           <Text color={"gray.light"}>{user.following.length}</Text>
//         </Flex>
//         <Flex className="insta">
//           <Box>
//             <Menu size={5} w={"20px"}>
//               <MenuButton
//                 px={4}
//                 // py={2}
//                 // transition='all 0.2s'
//                 // borderRadius='md'
//                 // borderWidth='1px'
//                 // _hover={{ bg: 'gray.400' }}
//                 // _expanded={{ bg: 'blue.400' }}
//                 // _focus={{ boxShadow: 'outline' }}
//               >
//                 <CgMoreO size={24} cursor={"pointer"} />
//               </MenuButton>
//               <MenuList size={5} w={"20px"}>
//                 <MenuItem bg={"gray.600"} onClick={copyUrl}>
//                   copy Link
//                 </MenuItem>
//               </MenuList>
//             </Menu>
//           </Box>
//         </Flex>
//       </Flex>
//       <Flex w={"full"}>
//         <Flex
//           flex={1}
//           borderBottom={"2px solid white"}
//           justifyContent={"center"}
//           pb={"3"}
//           cursor={"pointer"}
//         >
//           <Text>Moments</Text>
//         </Flex>
//         {/* <Flex
//           flex={1}
//           borderBottom={"2px solid  gray"}
//           justifyContent={"center"}
//           pb={"3"}
//           cursor={"pointer"}
//           color={"gray.light"}
//         >
//           <Text> Replies</Text>
//         </Flex> */}
//       </Flex>
//     </VStack>
//   );
// };

// export default Userheader;
 



import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Image,
} from "@chakra-ui/react";

import { Link as RouterLink } from "react-router-dom";
import React from "react";
import { FaInstagram } from "react-icons/fa";
import { CgMoreO } from "react-icons/cg";
import { useToast } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
const Userheader = ({ user }) => {
  const { handleFollowUnfollow, following, updating, followerCount } = useFollowUnfollow(user);
  const toastIdRef = React.useRef();
  const currentUser = useRecoilValue(userAtom);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toastIdRef.current = toast({ description: "Profile link copied" });
    });
  };

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <VStack justifyContent={"center"} gap={"20px"} alignItems={"self-start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"larger"} fontWeight={"hairline"} mt={3}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"} mt={3}>
            <Text fontFamily={"sans-serif"} fontSize={{ base: "xs", md: "sm", lg: "md" }}>
              {user.username}
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm", lg: "md" }}
              bg={useColorModeValue("gray.300", "gray.900")}
              color={"gray.light"}
              p={"1"}
              borderRadius={"full"}
            >
              momento.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {/* Clickable Avatar to Open Modal */}
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{ base: "md", md: "lg" }}
              cursor={"pointer"}
              onClick={onOpen}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{ base: "md", md: "lg" }}
              cursor={"pointer"}
              onClick={onOpen}
            />
          )}
        </Box>
      </Flex>

      {/* Modal for Enlarged Profile Picture */}
      <Modal isOpen={isOpen} onClose={onClose} h="200px" w="200px" >
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("white", "gray.800")}  h="200px" w="200px" borderRadius='50%' mr={'-350px'} >
          <ModalBody p={0} w={'200px'} h={'200px'} borderRadius={'50%'}>
            <Image src={user.profilePic || "https://bit.ly/broken-link"} alt={user.name} w="200px" borderRadius='50%' height={'200px'}/>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Text fontSize={{ base: "l", md: "md" }} fontWeight={"hairline"} fontFamily={"heading"}>
        {user.bio}
      </Text>
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to={"/update"}>
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"} flexDirection={"column"}>
          <Text color={"gray.light"}>Followers</Text>
          <Text color={"gray.light"}>{followerCount}</Text>
        </Flex>

        <Box w={2} h={2} bg={"gray.light"} borderRadius={"full"} mt={3}></Box>

        <Flex gap={2} alignItems={"center"} flexDirection={"column"}>
          <Text color={"gray.light"}>Following</Text>
          <Text color={"gray.light"}>{user.following.length}</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};
export default Userheader