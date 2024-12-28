import React from 'react'
'use client'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Checkbox,
  Link,
} from '@chakra-ui/react'
import {ColorRing} from "react-loader-spinner"
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useRecoilState, useSetRecoilState } from 'recoil'
import authScreenAtom from '../../atoms/AuthAtoms'
import userAtom from '../../atoms/userAtom'
import useShowtoast from '../../hooks/useShowtoast'
import FirstTimeUser from '../../atoms/FirstTimeUSer'

export default function Login() {
  const setFirstTimeuser=useSetRecoilState(FirstTimeUser)
  const [showPassword, setShowPassword] = useState(false)
  const[loading,setLoading]=useState(false)
  const setAuthScreen=useSetRecoilState(authScreenAtom)
  const setUser=useSetRecoilState(userAtom);
  const[inputs,setInputs]=useState({
    email:"",
    password:""
  })
const showToast=useShowtoast();
const handlekeypress=(event)=>{
if(event.key==='Enter'){
  handleLogin()}
};
const handleLogin=async()=>{
  setLoading(true)
    try {
        const res=await fetch("/api/users/login",{
            method:"POST",
            headers:{
            "Content-Type":"application/json",
            },
            body:JSON.stringify(inputs)
        })
        const data=await res.json();
        if(data.error){
            showToast("Error",data.error,"error");
            return;
        }
        localStorage.setItem("user-threads",JSON.stringify(data))
        setUser(data)
        showToast("Success","successfully logged-in!","success")
        setFirstTimeuser(false)
    } catch (error) {
        showToast("Error",data.error,"error");
    }finally{
      setLoading(false)
    }
}
  return (
    <Flex
    mt={"2px"}
   h={"550px"}
      align={'center'}
      justify={'center'}
 
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
        <Box mt={"20px"} ml={"10px"} >
        {
          loading?<ColorRing
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
          <Heading fontSize={'2xl'} textAlign={'center'}>
            Sign in to your account
          </Heading>
          <Text fontSize={'md'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('whiteAlpha.100', 'gray.700')}
          boxShadow={'2xl'}
          p={8} 
          border={"solid 1px gray"}
          w={{
            base:'full',
            sm:"400px",
                      }}
                      mt={'2'}
          >
        
            
          <Stack spacing={4} >
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" border={"solid 1px gray"}
              value={inputs.email}
              onChange={(e) => setInputs((inputs) => ({ ...inputs, email: e.target.value }))}
              onKeyDown={handlekeypress}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} border={"solid 1px gray"} 
                value={inputs.password} onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
                onKeyDown={handlekeypress}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={6}>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}>
              <Checkbox>Remember me</Checkbox>
              <Text color={'blue.500'}>Forgot password?</Text>
            </Stack>
            </Stack>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("blue.600","blue.600")}
                color={'white'}
                _hover={{
                  bg:useColorModeValue("blue.400","blue.400")
                }}
                onClick={handleLogin}
                >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'} onClick={()=>setAuthScreen("signup")}>
                Don't have an Account ? <Link color={'blue.400'}>  Signup</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}