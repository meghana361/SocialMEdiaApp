import { Button, Flex, Image, Link, useColorMode,useBreakpointValue,Box } from "@chakra-ui/react";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import LogoutButton from "../Auth/LogoutButton";

import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import authScreenAtom from "../../atoms/AuthAtoms";

const Header = () => {
  const avatarSize = useBreakpointValue({ base: "24", md: "34", lg: "40" });
  
  const setAuthScreen=useSetRecoilState(authScreenAtom)
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  return (
    <Flex justifyContent={"space-around"} mt={"20px"} mb={"4"}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={avatarSize} />
        </Link>
      )}
     {!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={12}
        src={colorMode === "dark" ? "/MomentoWhite.jpg" : "/MomentoDark.jpg"}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={avatarSize} />
          </Link>
        </Flex>
      )}
      <Box size={avatarSize}>

      {user && <LogoutButton />}
      </Box>
      {!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)}
    </Flex>
  );
};

export default Header;
