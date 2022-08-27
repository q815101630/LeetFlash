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
import { useNavigate, useParams } from "react-router-dom";

import { setNewPassword } from "apis/auth.api";

type FormState = "ready" | "saving";

const ResetPage = () => {
  let navigate = useNavigate();
  const toast = useToast();
  const useQuery = () => new URLSearchParams(window.location.search);
  const query = useQuery();
  const token = query.get("token") || "";

  const [password, setPassword] = React.useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>("");
  const [formState, setFormState] = React.useState<FormState>("ready");
  const bgColor = useColorModeValue("green.50", "blackAlpha.200");

  const toggleForgetPassword = async () => {
    if (password != passwordConfirm) {
      return toast({
        title: "Password not matched",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
    if (password.length < 6) {
      return toast({
        title: "Password must be at least 6 characters",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    } else {
      try {
        let res = await setNewPassword(token, password);
        toast({
          title: "Successfully reset password.",
          description: `Go to Sign in !`,
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <ScaleFade initialScale={0.95} in={true}>
        <VStack w="full" p={10} alignItems="flex-start" bg={bgColor}>
          <VStack spacing="3" alignItems="flex-start">
            <Heading size="xl">Type your new password:</Heading>
          </VStack>

          <SimpleGrid pt={3} columns={4} spacingX={2} spacingY={5} w="full">
            <GridItem colSpan={4}>
              <FormControl isRequired>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  placeholder="superpassword"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormErrorMessage>Password does not match</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={password !== passwordConfirm}>
                <FormLabel htmlFor="password">Confirm Password</FormLabel>
                <Input
                  placeholder="superpassword"
                  type="password"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={4}>
              <Button
                size="lg"
                w="full"
                variant="outline"
                onClick={toggleForgetPassword}
                isLoading={formState === "saving"}
                loadingText="Submitting"
              >
                Reset Password
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
    </>
  );
};

export default ResetPage;
