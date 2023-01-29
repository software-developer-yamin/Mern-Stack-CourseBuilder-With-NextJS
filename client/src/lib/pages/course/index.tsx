import { Grid, Heading } from "@chakra-ui/react";

const CoursePage = () => {
  return (
    <Grid minH="90vh" templateColumns={["1fr", "3fr 1fr"]}>
      <Heading>No Lectures</Heading>
    </Grid>
  );
};

export default CoursePage;
