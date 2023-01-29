import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log(email, password);
  };

  return (
    <Container h="95vh">
      <VStack h="full" justifyContent="center" spacing="16">
        <Heading>Welcome to CourseBundler</Heading>

        <form onSubmit={submitHandler} style={{ width: "100%" }}>
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
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              required
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              type="password"
              focusBorderColor="yellow.500"
            />
          </Box>

          <Box>
            <Link href="/forgetpassword">
              <Button fontSize="sm" variant="link">
                Forget Password?
              </Button>
            </Link>
          </Box>

          <Button my="4" colorScheme="yellow" type="submit">
            Login
          </Button>

          <Box my="4">
            New User?{" "}
            <Link href="/register">
              <Button colorScheme="yellow" variant="link">
                Sign Up
              </Button>{" "}
              here
            </Link>
          </Box>
        </form>
      </VStack>
    </Container>
  );
};

export default Login;
