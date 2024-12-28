import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import useShowtoast from "../../hooks/useShowtoast";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const LogoutButton = () => {
  const showToast = useShowtoast();
  const setUser = useSetRecoilState(userAtom);
  const navigate=useNavigate()
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body:JSON.stringify() since m not posting anytg
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user-threads")
      setUser(null);
      showToast("success!", "Successfully logged-out", "success");
      navigate("/auth")
    } catch (error) {
      showToast("Error", data.error, "error");
    }
  };
  return (
    <Flex
    
    >
      <Button
      border={"solid 1px white"}
        // position={"fixed"}
        top={"10px"}
        right={"20px"}
        size={"sm"}
        onClick={handleLogout}
        display={"flex"}
      >
        <MdLogout size={"20px"} />
      {/* <Text fontSize={{ base: "sm", md: "sm" }}>Logout</Text> */}
      </Button>
    </Flex>
  );
};

export default LogoutButton;
