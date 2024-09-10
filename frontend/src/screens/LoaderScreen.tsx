import { Flex, Loader, rem } from "@mantine/core";

const LoaderScreen = () => {
  return (
    <Flex w={"100%"} h={"100%"} justify={"center"} mt={rem(40)}>
      <Loader />
    </Flex>
  );
};

export default LoaderScreen;
