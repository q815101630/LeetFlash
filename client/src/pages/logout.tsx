import React from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { clearUserState, signOutUserAsync } from "../redux/user/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { selectSettings } from "redux/settings/settingsSlice";
export const Logout = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  const { socket } = useAppSelector(selectSettings);

  const cancelRef = React.useRef(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onLogout = () => {
    setIsOpen(false);

    dispatch(clearUserState());
    dispatch(signOutUserAsync());
    navigate("/");
  };
  const onClose = () => {
    setIsOpen(false);
    navigate(-1);
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Logout
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onLogout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
