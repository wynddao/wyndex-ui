import { Center, Flex, Image } from "@chakra-ui/react";

export default function Loader() {
  return (
    <>
      <style>
        {`body {
                margin:0!important
            }`}
      </style>
      <Flex
        bgColor={"#131222"}
        p={0}
        width={"100vw"}
        height={"100vh"}
        alignContent={"center"}
        justifyContent={"center"}
      >
        <Center>
          <Image src={"/druid.gif"} alt="loading druid" />
        </Center>
      </Flex>
    </>
  );
}
