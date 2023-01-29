import {
  Avatar,
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

export const fileUploadCss = {
  cursor: "pointer",
  marginLeft: "-5%",
  width: "110%",
  border: "none",
  height: "100%",
  color: "#ECC94B",
  backgroundColor: "white",
};

const fileUploadStyle = {
  "&::file-selector-button": fileUploadCss,
};

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [imagePrev, setImagePrev] = useState<string | ArrayBuffer | null>("");
  const [image, setImage] = useState<string | Blob | File>("");

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagePrev(reader?.result);
        setImage(file);
      };
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.append("name", name);
    myForm.append("email", email);
    myForm.append("password", password);
    myForm.append("file", image);
  };

  return (
    <Container h="95vh" mb="16">
      <VStack h="full" justifyContent="center" spacing="16">
        <Heading textTransform="uppercase">Registration</Heading>

        <form onSubmit={submitHandler} style={{ width: "100%" }}>
          <Box my="4" display="flex" justifyContent="center">
            <Avatar src={imagePrev as string} size="2xl" objectFit="contain" />
          </Box>
          <Box my="4">
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              required
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="abc"
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

          <Box my="4">
            <FormLabel htmlFor="chooseAvatar">Choose Avatar</FormLabel>
            <Input
              accept="image/*"
              required
              id="chooseAvatar"
              type="file"
              focusBorderColor="yellow.500"
              css={fileUploadStyle}
              onChange={changeImageHandler}
            />
          </Box>

          <Button my="4" colorScheme="yellow" type="submit">
            Sign Up
          </Button>

          <Box my="4">
            Already Signed Up?{" "}
            <Link href="/auth/login">
              <Button colorScheme="yellow" variant="link">
                Login
              </Button>{" "}
              here
            </Link>
          </Box>
        </form>
      </VStack>
    </Container>
  );
};

export default Register;
