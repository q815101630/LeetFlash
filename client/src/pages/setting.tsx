import {
  Box,
  Center,
  Drawer,
  Flex,
  Text,
  useDisclosure,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  Divider,
  Tooltip,
  Button,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  generateApiTokenAsync,
  patchUserAsync,
  selectUser,
  toggleSponsorMsg,
} from "../redux/user/userSlice";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import { patchUser } from "apis/data.api";

export const enum DisplayType {
  API,
  GENERAL,
  COMMENTS,
}

export const Setting = ({
  isSettingsOpen,
  onSettingsOpen,
  onSettingsClose,
}: {
  isSettingsOpen: boolean;
  onSettingsOpen: () => void;
  onSettingsClose: () => void;
}) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [value, setValue] = useState<number>(1);

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const toast = useToast();

  // useEffect(() => {
  //   if (user.token === "invalid") {
  //     dispatch(generateApiTokenAsync());
  //   }
  // }, [user.token]);

  const saveSequenceHandler = async () => {
    dispatch(patchUserAsync({ ...user, total_stages: sequence })).then(
      ({ meta: { requestStatus } }) => {
        if (requestStatus === "rejected") {
          toast({
            position: "top",
            title: "Review Sequence Failed to save.",
            description: "Failed to save review sequence. Please try again!",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        } else {
          toast({
            position: "top",
            title: "Review Sequence Saved. 👌",
            description: "The review sequence has been successfully saved.",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }
      }
    );
  };

  return (
    <>
      {/* <Flex>
        <SideBar setDisplayType={setDisplayType} />
        <Box h="90vh" mt="2.5vh" mx="2.5vh" w="100%">
          {displayType === DisplayType.API && <TokenSettingContent />}
        </Box>
      </Flex> */}

      <Drawer onClose={onSettingsClose} isOpen={isSettingsOpen} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>{`Settings`}</DrawerHeader>
          <DrawerBody>
            <VStack align="start">
              <Box>
                <Text as="u">API Token:</Text>
                <Text> {user.id}</Text>
              </Box>
              <Divider />
              <Tooltip
                label="Recommend Sequence: [2 5 8 14 30 60 90]"
                placement="top"
                hasArrow
              >
                <Text as="u">Current Review Sequence:</Text>
              </Tooltip>
              <HStack>
                {user.total_stages.map((stage) => (
                  <Badge colorScheme="green">{stage}</Badge>
                ))}
              </HStack>
              <Text as="u">Set Review Sequence:</Text>
              <HStack>
                {sequence.length == 0 && (
                  <Text>Input number to edit review sequence</Text>
                )}
                {sequence.map((stage) => (
                  <Badge>{stage}</Badge>
                ))}
              </HStack>

              <HStack>
                <NumberInput
                  min={1}
                  max={365}
                  value={value}
                  onChange={(valueString) => setValue(parseInt(valueString))}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setSequence((sequence) => {
                        if (isNaN(value)) {
                          return [...sequence, 1];
                        } else {
                          return [...sequence, value];
                        }
                      });
                    }
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Button
                  onClick={() => {
                    setSequence((sequence) => {
                      if (isNaN(value)) {
                        return [...sequence, 1];
                      } else {
                        return [...sequence, value];
                      }
                    });
                  }}
                >
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setSequence([]);
                  }}
                >
                  Reset
                </Button>
                <Button
                  onClick={saveSequenceHandler}
                  disabled={sequence.length === 0}
                >
                  Save
                </Button>
              </HStack>
              <Divider />
              <Button
                onClick={() => {
                  dispatch(toggleSponsorMsg());

                  toast({
                    position: "top",
                    title: "Sponsor Message Updated. 👌",
                    description: `Sponsor Message has been ${
                      user.display_sponsor_msg ? "disable" : "enable"
                    }`,
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                  });
                }}
              >
                {user.display_sponsor_msg ? "Disable Sponsor Message" : "Enable Sponsor Message"}
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
