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
  ScaleFade,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  loginUserAsync,
  selectUser,
  signUpUserAsync,
} from "../redux/user/userSlice";
import { validateEmail } from "../utils/validates";

type FormState = "ready" | "saving";

const SignUpVStack = ({ toggleSignUp }: { toggleSignUp: () => void }) => {
  const bgColor1 = useColorModeValue("pink.50", "whiteAlpha.50");

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>("");
  const [emailErrors, setEmailErrors] = React.useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = React.useState<string[]>([]);
  const [formState, setFormState] = React.useState<FormState>("ready");
  const user = useAppSelector(selectUser);
  const toast = useToast();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.status === "inactive" && user.error) {
      console.log(user.error);
      toast({
        title: "Sign up Failed",
        description: user.error,
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    } else if (user.status === "active") {
      toast({
        title: "Sign up Success",
        description: "Welcome!",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [user.status]);

  const onSubmit = () => {
    setFormState("saving");
    const emailErrors = [];
    const passwordErrors = [];
    if (!validateEmail(email)) {
      emailErrors.push("Invalid email");
    }
    if (password.length < 6) {
      passwordErrors.push("Password must be at least 6 characters");
    }

    setEmailErrors(emailErrors);
    setPasswordErrors(passwordErrors);

    if (emailErrors.length === 0 && passwordErrors.length === 0) {
      dispatch(signUpUserAsync({ email, password }));
    }
    setTimeout(() => {
      setFormState("ready");
    }, 1000);
  };

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
            <FormControl isRequired isInvalid={emailErrors.length !== 0}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                placeholder="solution@accept.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailErrors.map((error) => (
                <FormErrorMessage key={error}>{error}</FormErrorMessage>
              ))}
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <FormControl isRequired isInvalid={passwordErrors.length !== 0}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                placeholder="superpassword"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordErrors.map((error) => (
                <FormErrorMessage key={error}>{error}</FormErrorMessage>
              ))}
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <FormControl isRequired isInvalid={password !== passwordConfirm}>
              <FormLabel htmlFor="password-again">Confirm Password</FormLabel>
              <Input
                placeholder="superpassword"
                type="password"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <FormErrorMessage>Password does not match</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <Button
              size="lg"
              w="full"
              onClick={onSubmit}
              isLoading={formState === "saving"}
              loadingText="Submitting"
              colorScheme="teal"
              variant="outline"
            >
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
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errors, setErrors] = React.useState<string[]>([]);
  const [formState, setFormState] = React.useState<FormState>("ready");
  const user = useAppSelector(selectUser);
  const toast = useToast();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.status === "inactive" && user.error) {
      console.log(user.error);
      toast({
        title: "Login Failed",
        description: user.error,
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    } else if (user.status === "active") {
      toast({
        title: "Login Success",
        description: "Welcome back!",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [user.status]);

  const onSubmit = () => {
    setFormState("saving");

    const errors = [];
    if (!validateEmail(email)) {
      errors.push("Invalid credential");
    }
    setErrors(errors);

    if (errors.length === 0) {
      dispatch(loginUserAsync({ email, password }));
    }
    setTimeout(() => {
      setFormState("ready");
    }, 1000);
  };
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
            <FormControl isRequired isInvalid={errors.length !== 0}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                placeholder="solution@accept.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <FormControl isRequired isInvalid={errors.length !== 0}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                placeholder="superpassword"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.map((error) => (
                <FormErrorMessage key={error}>{error}</FormErrorMessage>
              ))}
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <Button
              size="lg"
              w="full"
              onClick={onSubmit}
              isLoading={formState === "saving"}
              loadingText="Submitting"
              colorScheme="teal"
              variant="outline"
            >
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
