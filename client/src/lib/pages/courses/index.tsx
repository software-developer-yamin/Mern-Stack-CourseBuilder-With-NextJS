import {
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

import Course from "lib/components/Course";

const Courses = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    "Web development",
    "Artificial Intellegence",
    "Data Structure & Algorithm",
    "App Development",
    "Data Science",
    "Game Development",
  ];

  return (
    <Container minH="95vh" maxW="container.lg" paddingY="8">
      <Heading m="8">All Courses</Heading>
      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search a course..."
        type="text"
        focusBorderColor="yellow.500"
      />
      <HStack
        overflowX="auto"
        paddingY="8"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {categories.map((item) => (
          <Button key={item} onClick={() => setCategory(item)} minW="60">
            <Text>{item}</Text>
          </Button>
        ))}
      </HStack>
      <Stack
        direction={["column", "row"]}
        flexWrap="wrap"
        justifyContent={["flex-start", "space-evenly"]}
        alignItems={["center", "flex-start"]}
      >
        {category === "" ? (
          <Course
            key="item._id"
            title="item.title"
            description="item.description"
            views={5}
            imageSrc="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Y291cnNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
            id="item._id"
            creator="item.createdBy"
            lectureCount={2}
            addToPlaylistHandler={() => {
              // eslint-disable-next-line no-console
              console.log("click to add to playlist");
            }}
            loading={false}
          />
        ) : (
          <Heading mt="4">Courses Not Found</Heading>
        )}
      </Stack>
    </Container>
  );
};

export default Courses;
