import React from "react";
("use client");
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
} from "@chakra-ui/react";

import {ColorRing} from "react-loader-spinner"
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../../atoms/AuthAtoms";
import useShowtoast from "../../hooks/useShowtoast";
import userAtom from "../../atoms/userAtom";
import FirstTimeUser from "../../atoms/FirstTimeUSer";


export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setFirstTimeUser=useSetRecoilState(FirstTimeUser);
  const showToast = useShowtoast();
  const setUser=useSetRecoilState(userAtom)
  const[loading,setLoading]=useState(false)
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const handlekeypress=(event)=>{
    if(event.key==='Enter'){
      handleLogin()}
    };
  const handleSignup = async () => {
    console.log(inputs);
    setLoading(true)
    
    try {
      //refer chatgpt proxy "/api": Any request starting with /api will be forwarded.
      // target: "http://localhost:5000": The target server that will handle /api requests.
      //If there were no proxy, the frontend would try to make a request to http://localhost:5000/api/users,
      //  which would trigger a CORS error due to the different ports (3000 vs. 5000).
      //"http://localhost:5000/api/users
      //"/tareget/api/users"
      /* plugins: [react()],
  server:{
    port:3000,
    proxy:{
      "/api":{
        target:"http://localhost:5000",
        changeOrigin:true,
        secure:false
      }
    }*/
      const res = await fetch("api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
              }
              localStorage.setItem("user-threads",JSON.stringify(data))
              setUser(data)
              showToast("success!","Successfully signed-in","success")
              setFirstTimeUser(true)
    } catch (error) {
        showToast("Error", error, "error");
    }finally{
      setLoading(false)
    }
  };

  return (
    <Flex
    mb={"40px"}
      h={"600px"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      
    >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"} >
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
          <Heading fontSize={"xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"md"} color={"gray.600"}>
            to connect with friends ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("whiteAlpha.100", "gray.700")}
          boxShadow={"2xl"}
          p={8}
          border={"solid 1px gray"}
          mb={"30px"}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text" border={"solid 1px gray"}
                  value={inputs.name}
                  onChange={(e)=>setInputs({...inputs,name:e.target.value})}
                  onKeyDown={handlekeypress}
                  />
                </FormControl>
              </Box>
              <Box p={"1"}>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" border={"solid 1px gray"} 
                  value={inputs.username}
                  onChange={(e)=>setInputs({...inputs,username:e.target.value})}
                  onKeyDown={handlekeypress}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" border={"solid 1px gray"} 
                   value={inputs.email}
                  onChange={(e)=>setInputs({...inputs,email:e.target.value})} 
                  onKeyDown={handlekeypress}
                  />
            </FormControl>
            
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  border={"solid 1px gray"}
                  value={inputs.password}
                  onChange={(e)=>setInputs({...inputs,password:e.target.value})} //if password was arry then [password]:e.target.value
                  onKeyDown={handlekeypress}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
         

            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("blue.600", "blue.600")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("blue.400", "blue.400"),
                }}
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"} onClick={() => setAuthScreen("login")}>
                Already a user? <Link color={"blue.400"}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
