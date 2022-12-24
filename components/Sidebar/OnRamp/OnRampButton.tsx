import { Button, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import OnRampModal from "./OnRampModal";

export default function OnRampButton() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <>
      <Button backgroundColor={"wynd.base.subBg"} _hover={{ backgroundColor: "wynd.grey.700"}} py={8} onClick={() => setModalOpen(true)} whiteSpace="unset" w="100%">
        <Text fontSize="xs" display="inline">
          Need more crypto?{" "}
        </Text>{" "}
        <br />
        <Text
          textAlign="center"
          fontSize="xl"
          display="inline"
          bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
          bgClip="text"
        >
          <Image margin="auto" src="/images/Kado.svg" alt="Kado Onramp" /> Onramp!
        </Text>
      </Button>
      <OnRampModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
