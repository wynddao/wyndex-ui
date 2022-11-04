"use client";

import { Button, Container, FormControl, FormErrorMessage, FormLabel, Input, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import * as zod from "zod";
import { myAddressAtom } from "../state/recoil/atoms";

const schema = zod.object({
  address: zod.number(),
});

type Schema = zod.infer<typeof schema>;

export default function InputAddressForm() {
  const [myAddress, setMyAddress] = useRecoilState(myAddressAtom);

  const { register, handleSubmit, formState } = useForm<Schema>({ resolver: zodResolver(schema) });

  function onSubmit({ address }: Schema) {
    setMyAddress(address);
  }

  return (
    <Container maxW={"2xl"} pt={{ base: 10, md: 18 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <FormControl isInvalid={!formState.isValid && formState.isDirty}>
            <FormLabel>Enter numeric address</FormLabel>
            <Input
              {...register("address", {
                valueAsNumber: true,
              })}
            />
            <FormErrorMessage>{formState.errors.address?.message}</FormErrorMessage>
          </FormControl>
          <Button type="submit" disabled={!formState.isValid}>
            Submit address
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
