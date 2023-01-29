import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Container h="92vh">
      <VStack h="full" justifyContent="center" spacing="16">
        <Heading>Contact Us</Heading>

        <form onSubmit={submitHandler} style={{ width: "100%" }}>
          <Box my="4">
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              required
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Abc"
              type="text"
              focusBorderColor="yellow.500"
            />
          </Box>

          <Box my="4">
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              required
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              type="email"
              focusBorderColor="yellow.500"
            />
          </Box>

          <Box my="4">
            <FormLabel htmlFor="message">Message</FormLabel>
            <Textarea
              required
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message...."
              focusBorderColor="yellow.500"
            />
          </Box>

          <Button my="4" colorScheme="yellow" type="submit">
            Send Mail
          </Button>

          <Box my="4">
            Request for a course?{" "}
            <Link href="/request">
              <Button colorScheme="yellow" variant="link">
                Click
              </Button>{" "}
              here
            </Link>
          </Box>
        </form>
      </VStack>
    </Container>
  );
};

export default Contact;
