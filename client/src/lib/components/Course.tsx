import {
  Button,
  Heading,
  HStack,
  Stack,
  VStack,
  Text,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";

const Course = ({
  views,
  title,
  imageSrc,
  id,
  addToPlaylistHandler,
  creator,
  description,
  lectureCount,
  loading,
}: CourseProps) => {
  return (
    <VStack className="course" alignItems={["center", "flex-start"]}>
      <Image src={imageSrc} boxSize="60" objectFit="contain" alt="imageSrc" />
      <Heading
        textAlign={["center", "left"]}
        maxW="200px"
        size="sm"
        fontFamily="sans-serif"
        noOfLines={3}
      >
        {title}
      </Heading>
      <Text noOfLines={2}> {description} </Text>

      <HStack>
        <Text fontWeight="bold" textTransform="uppercase">
          Creator
        </Text>

        <Text fontFamily="body" textTransform="uppercase">
          {creator}
        </Text>
      </HStack>

      <Heading textAlign="center" size="xs" textTransform="uppercase">
        Lectures - {lectureCount}
      </Heading>

      <Heading size="xs" textTransform="uppercase">
        Views - {views}
      </Heading>

      <Stack direction={["column", "row"]} alignItems="center">
        <Link href={`/course/${id}`}>
          <Button colorScheme="yellow">Watch Now</Button>
        </Link>
        <Button
          isLoading={loading}
          variant="ghost"
          colorScheme="yellow"
          onClick={() => addToPlaylistHandler(id)}
        >
          Add to playlist
        </Button>
      </Stack>
    </VStack>
  );
};

export default Course;
