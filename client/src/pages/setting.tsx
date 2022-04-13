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
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { generateApiTokenAsync, selectUser } from "../redux/user/userSlice";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";

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
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (user.token === "invalid") {
  //     dispatch(generateApiTokenAsync());
  //   }
  // }, [user.token]);

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
            <HStack>
              <Box>
                <Text>API Token:</Text>
                <Text> {user.id}</Text>
              </Box>
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
