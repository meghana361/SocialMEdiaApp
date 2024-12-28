'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Box
} from '@chakra-ui/react'
import {ColorRing} from "react-loader-spinner"
import { SmallCloseIcon } from '@chakra-ui/icons'
import { useRef, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import userAtom from '../../atoms/userAtom'
import useImageDisplay from '../../hooks/useImageDisplay'
import useShowtoast from '../../hooks/useShowtoast'
import FirstTimeUser from '../../atoms/FirstTimeUSer'
import { useNavigate } from "react-router-dom";
export default function UpdateProfilePage() {
  const[user,setUser]=useRecoilState(userAtom)
  const showToast=useShowtoast()
  
  const [inputs,setInputs]=useState({
name:user.name,
username:user.username,
email:user.email,
bio:user.bio,

password:""

  })
  const [updating, setUpdating] = useState(false);
  const setFirstTimeuser=useSetRecoilState(FirstTimeUser)
  const navigate=useNavigate()
  const handleSubmit=async(e)=>{
    /*If your JavaScript code is meant to handle the form submission 
    (like making an API call) without refreshing the page, it won’t work as intended. 
    The page will refresh before your JavaScript code runs, leading to a loss of any state or user input.*/
    e.preventDefault();
    if (updating) return;
		setUpdating(true);
    try {
      const res=await fetch(`/api/users/update/${user._id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({...inputs,profilePic:imgUrl})
      })
      const data=await res.json()
      if(data.error){
        showToast("Error", data.error, "error");
        return;
      }
      setUser(data)
      localStorage.setItem("user-threads",JSON.stringify(data))
      showToast("success!","Successfully updated your profile","success")
      setFirstTimeuser(false)
      navigate(`/${user.username}`)
      
      
    } catch (error) {

      showToast("Error", error, "error");
    }
    finally {
			setUpdating(false);
		}
      

  }
  const fileRef=useRef(null);
  const{handleImageChange,imgUrl}=useImageDisplay()
  return (
    <form onSubmit={handleSubmit}>
 <Box mt={"20px"} ml={"10px"} >
        {
          updating?<ColorRing
          visible={true}
          height="50"
          width="50"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={['#e03541', '#218ccf', '#d7ea27', '#342aff', '#849b87']}
          />:""
        }
      </Box>
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
      >
      <Stack
        spacing={4}
        w={'400px'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={4}
        my={6}
        
        border={"solid 1px gray"} >
        <Heading lineHeight={1.1} fontSize={{ base: 'xl', sm: '2xl' }}>
       Edit Profile
        </Heading>
        <FormControl id="userName">
          
          <Stack direction={['column', 'row']} spacing={6} >
            <Center>
              <Avatar size="xl" src={imgUrl||user.profilePic}>
                {/* <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                  /> */}
              </Avatar>
            </Center>
            <Center w="full">
            {/* 
               To create a button that allows users to 
               upload a file while keeping the file input hidden, 
               you'll need to connect the button click event to the hidden input element.
                When the button is clicked, it should trigger a click event 
                on the hidden file input. This is how you can do it: */}
              <Button w="full"  border={"solid 1px gray"} onClick={()=>fileRef.current.click()}>Edit picture</Button>
              <input type="file" hidden ref={fileRef} onChange={handleImageChange}/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="FullName" isRequired>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="your name"
            _placeholder={{ color: 'gray.500' }}
            type="text" 
            border={"solid 1px gray"} 
            value={inputs.name}
            onChange={(e)=>setInputs({...inputs,name:e.target.value})}
            />
        </FormControl>
        <FormControl id="username" isRequired>
          <FormLabel>username</FormLabel>
          <Input
            placeholder="username"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            border={"solid 1px gray"} 
            value={inputs.username}
            onChange={(e)=>setInputs({...inputs,username:e.target.value})}
            />
        </FormControl>
        <FormControl id="bio" isRequired>
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Bio"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            border={"solid 1px gray"} 
            value={inputs.bio}
            onChange={(e)=>setInputs({...inputs,bio:e.target.value})}
            />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            border={"solid 1px gray"} 
            value={inputs.email}
            onChange={(e)=>setInputs({...inputs,email:e.target.value})}
            />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            border={"solid 1px gray"}
            value={inputs.password}
            onChange={(e)=>setInputs({...inputs,password:e.target.value})}
            />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}
            // onClick={() => navigate(`/${user.username}`)}
            onClick={()=>navigate(-1)}
            >
            Cancel
          </Button>
          <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}
            type='submit'
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
              </form>
  )
}