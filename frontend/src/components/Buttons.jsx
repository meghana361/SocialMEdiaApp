import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useState } from "react";

const Buttons = () => {
  const [selectedTopic, setSelectedTopic] = useState("tableu");

  const dataTableu = ["Introduction", "Tableu basics", "Data with tableu"];
  const dataPowerbi = [
    "Introduction to powerbi",
    "basics of powerbi ",
    " expalore Data with power",
  ];
  return (
    <Box>
      <Flex justifyContent={"flex-start"}>
        <Button mr={"10px"} onClick={() => setSelectedTopic("tableu")}>
          Tableu
        </Button>
        <Button onClick={() => setSelectedTopic("powerbi")}>Powerbi</Button>
      </Flex>

      {selectedTopic === "tableu" ? (
        <Flex
          border={"solid 2px gray"}
          borderRadius={"10px"}
          boxShadow={"2xl"}
          mt={"30px"}
          mb={"20px"}
          padding={"30px"}
          flexDirection={'column'}

        >
          {dataTableu.map((d, index) => (
            
            <Button 
            key={index}
               border={"solid 2px gray"}
            borderRadius={"10px"}
            boxShadow={"2xl"}
            mt={"30px"}
            mb={"20px"}
            padding={"30px"}
            textColor={'gray.800'}
            fontSize={'xl'}
            bg={'green.300'}
            _hover={
                {
                textColor:'gray.200',
                bg:'green.600'
            }}
            >{d}</Button>
          ))}
        </Flex>
      ) : (
        <Flex
        border={"solid 2px gray"}
        borderRadius={"10px"}
        boxShadow={"2xl"}
        mt={"30px"}
        mb={"20px"}
        padding={"30px"}
        flexDirection={'column'}


      >
          {dataPowerbi.map((d, index) => (
            <Button key={index}  
             border={"solid 2px gray"}
            borderRadius={"10px"}
            boxShadow={"2xl"}
            mt={"30px"}
            mb={"20px"}
            padding={"30px"}
            textColor={'gray.800'}
            fontSize={'xl'}
            bg={'green.300'}
    
            _hover={
                {
                textColor:'gray.200',
                bg:'green.600'
            }}
            >{d}</Button>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default Buttons;
