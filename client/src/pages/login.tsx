import {
  Container,
  Flex,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  GridItem,
  Button,
  useColorMode,
  useColorModeValue,
  Link,
  useDisclosure,
  ScaleFade,
} from "@chakra-ui/react";
import React from "react";

const SignUpVStack = ({ toggleSignUp }: { toggleSignUp: () => void }) => {
  const bgColor1 = useColorModeValue("pink.50", "whiteAlpha.50");

  return (
    <ScaleFade initialScale={0.95} in={true}>
      <VStack
        w="full"
        p={10}
        spacing={10}
        alignItems="flex-start"
        bg={bgColor1}
      >
        <VStack spacing="3" alignItems="flex-start">
          <Heading size="xl">Sign up LeetFlash</Heading>
          <Text>
            Sign up LeetFlash today to review your LeetCode problem like a
            flash!
          </Text>
        </VStack>
        <SimpleGrid columns={4} columnGap={3} rowGap={6} w="full">
          <GridItem colSpan={4}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input placeholder="solution@accept.com" type="email" />
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input placeholder="superpassword" type="password" />
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <FormControl>
              <FormLabel htmlFor="password-again">Password Again</FormLabel>
              <Input placeholder="superpassword" type="password" />
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <Button size="lg" w="full">
              Sign up
            </Button>
          </GridItem>
          <GridItem colSpan={4}>
            <Link onClick={toggleSignUp} href="#">
              Already have account?
            </Link>
          </GridItem>
        </SimpleGrid>
      </VStack>
    </ScaleFade>
  );
};

const SignInVStack = ({ toggleSignUp }: { toggleSignUp: () => void }) => {
  const bgColor2 = useColorModeValue("blue.50", "blackAlpha.200");

  return (
    <ScaleFade initialScale={0.95} in={true}>
      <VStack
        w="full"
        h="full"
        p={10}
        spacing={10}
        alignItems="flex-start"
        bg={bgColor2}
      >
        <VStack spacing="3" alignItems="flex-start">
          <Heading size="xl">Sign in </Heading>
          <Text>Already have an account?</Text>
        </VStack>
        <SimpleGrid columns={4} columnGap={3} rowGap={6} w="full">
          <GridItem colSpan={4}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input placeholder="solution@accept.com" type="email" />
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input placeholder="superpassword" type="password" />
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <Button size="lg" w="full">
              Sign in
            </Button>
          </GridItem>
          <GridItem colSpan={4}>
            <Link onClick={toggleSignUp} href="#">
              No account? Sign up here!
            </Link>
          </GridItem>
        </SimpleGrid>
      </VStack>
    </ScaleFade>
  );
};

const LoginPage = () => {
  const { toggleColorMode } = useColorMode();

  const [signUp, setSignUp] = React.useState<boolean>(false);

  const toggleSignUp = () => {
    setSignUp(!signUp);
  };
  return (
    <Container h="100vh" maxW="container.sm" px={0} py={20}>
      <Button onClick={toggleColorMode}>Change color mode</Button>
      {signUp ? (
        <SignUpVStack toggleSignUp={toggleSignUp} />
      ) : (
        <SignInVStack toggleSignUp={toggleSignUp} />
      )}
    </Container>
  );
};

export default LoginPage;
