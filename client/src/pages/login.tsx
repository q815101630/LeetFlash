import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Link,
  ScaleFade,
  SimpleGrid,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useLayoutEffect, useRef } from "react";
import { AiFillWechat } from "react-icons/ai";
import { BsGithub } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  checkProfileAsync,
  loginUserAsync,
  selectUser,
  sendResetPasswordAsync,
  signUpUserAsync,
} from "../redux/user/userSlice";
import { validateEmail } from "../utils/validates";
import { onClickGitHubHandler, onClickWeChatHandler } from "./oauthHandler";
import GoogleButton from "./../components/GoogleButton";

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
  let navigate = useNavigate();

  const dispatch = useAppDispatch();

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    // forbids the first run at the time of mount
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
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
        description: `Welcome back! ${user.email}`,
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  }, [navigate, toast, user.email, user.error, user.status]);

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

    if (password !== passwordConfirm) {
      passwordErrors.push("Password does not match");
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
      <VStack w="full" p={10} alignItems="flex-start" bg={bgColor1}>
        <VStack spacing="3" alignItems="flex-start">
          <Heading size="xl">Sign up LeetFlash</Heading>
          <Text>
            Sign up LeetFlash today to review your LeetCode problem like a
            flash!
          </Text>
        </VStack>
        <SimpleGrid pt={3} columns={4} spacingX={2} spacingY={5} w="full">
          <GridItem colSpan={1}>
            <GoogleButton />
          </GridItem>
          <GridItem colSpan={1}>
            <Button
              size="md"
              w="full"
              onClick={onClickGitHubHandler}
              colorScheme="teal"
              variant="outline"
              leftIcon={<BsGithub />}
            >
              GitHub
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Button
              size="md"
              w="full"
              onClick={onClickWeChatHandler}
              colorScheme="teal"
              variant="outline"
              leftIcon={<AiFillWechat />}
            >
              WeChat
            </Button>
          </GridItem>
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
              Sign Up
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

const SignInVStack = ({
  toggleSignUp,
  toggleForgetPassword,
}: {
  toggleSignUp: () => void;
  toggleForgetPassword: () => void;
}) => {
  const bgColor2 = useColorModeValue("blue.50", "blackAlpha.200");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errors, setErrors] = React.useState<string[]>([]);
  const [formState, setFormState] = React.useState<FormState>("ready");
  const user = useAppSelector(selectUser);
  const toast = useToast();

  const dispatch = useAppDispatch();

  const firstUpdate = useRef(true);
  let navigate = useNavigate();

  useLayoutEffect(() => {
    // forbids the first run at the time of mount
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
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
        description: `Welcome back! ${user.email}`,
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  }, [navigate, toast, user.email, user.error, user.status]);

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
      <VStack w="full" p={10} alignItems="flex-start" bg={bgColor2}>
        <VStack spacing="3" alignItems="flex-start">
          <Heading size="xl">Sign in LeetFlash</Heading>
          <Text>Already have an account?</Text>
        </VStack>

        <SimpleGrid pt={3} columns={4} spacingX={2} spacingY={5} w="full">
          <GridItem colSpan={1}>
            <GoogleButton />
          </GridItem>
          <GridItem colSpan={1}>
            <Button
              size="md"
              w="full"
              onClick={onClickGitHubHandler}
              colorScheme="teal"
              variant="outline"
              leftIcon={<BsGithub />}
            >
              GitHub
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Button
              size="md"
              w="full"
              onClick={onClickWeChatHandler}
              colorScheme="teal"
              variant="outline"
              leftIcon={<AiFillWechat />}
            >
              WeChat
            </Button>
          </GridItem>
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
          <GridItem colSpan={2}>
            <Link onClick={toggleSignUp} href="#">
              No account? Sign up here!
            </Link>
          </GridItem>
          <GridItem colSpan={2} justifySelf="end">
            <Link onClick={toggleForgetPassword} href="#">
              Forgot Password?
            </Link>
          </GridItem>
        </SimpleGrid>
      </VStack>
    </ScaleFade>
  );
};

const ForgetPasswordVStack = ({
  toggleForgetPassword,
}: {
  toggleForgetPassword: () => void;
}) => {
  const bgColor = useColorModeValue("green.50", "blackAlpha.200");

  const [email, setEmail] = React.useState<string>("");
  const [formState, setFormState] = React.useState<FormState>("ready");

  const toast = useToast();
  const dispatch = useAppDispatch();
  const onSubmit = () => {
    setFormState("saving");
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Invalid email",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    dispatch(sendResetPasswordAsync(email));
    setTimeout(() => {
      setFormState("ready");
      toast({
        title: "Reset Password Request Sent",
        description: `If an email is found, we will send an reset password request to your inbox. Thank you!`,
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }, 5000);
  };
  return (
    <ScaleFade initialScale={0.95} in={true}>
      <VStack w="full" p={10} alignItems="flex-start" bg={bgColor}>
        <VStack spacing="3" alignItems="flex-start">
          <Heading size="xl">Forgot Password?</Heading>
        </VStack>

        <SimpleGrid pt={3} columns={4} spacingX={2} spacingY={5} w="full">
          <GridItem colSpan={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                placeholder="solution@accept.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={4}>
            <Button
              size="lg"
              w="full"
              variant="outline"
              onClick={onSubmit}
              isLoading={formState === "saving"}
              loadingText="Submitting"
            >
              Send Password Reset Request
            </Button>
          </GridItem>
          <GridItem colSpan={4} justifySelf="end">
            <Link onClick={toggleForgetPassword} href="#">
              Go to sign in
            </Link>
          </GridItem>
        </SimpleGrid>
      </VStack>
    </ScaleFade>
  );
};

const LoginPage = () => {
  const [signUp, setSignUp] = React.useState<boolean>(false);
  const [forgetPassword, setForgetPassword] = React.useState<boolean>(false);

  const toggleSignUp = () => {
    setSignUp(!signUp);
  };

  const toggleForgetPassword = () => {
    setForgetPassword(!forgetPassword);
  };

  return (
    <>
      <Container h="100vh" maxW="container.sm" px={0} py={20}>
        {forgetPassword && (
          <ForgetPasswordVStack toggleForgetPassword={toggleForgetPassword} />
        )}

        {!forgetPassword && signUp && (
          <SignUpVStack toggleSignUp={toggleSignUp} />
        )}
        {!forgetPassword && !signUp && (
          <SignInVStack
            toggleSignUp={toggleSignUp}
            toggleForgetPassword={toggleForgetPassword}
          />
        )}
      </Container>
    </>
  );
};

export default LoginPage;
