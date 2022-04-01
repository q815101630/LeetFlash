import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Card } from "interfaces/interfaces";
import { useEffect } from "react";
import { useAppSelector } from "redux/hooks";
import { selectSettings } from "redux/settings/settingsSlice";
import { formatDate } from "utils";

export interface PopupModelProps {
  card: Card;
  text: string;
  btn1Text: string;
  btn2Text: string;
  header: string;
  btn1Handler: () => void;
  removePopup: () => void;
}

const PopupModal = ({
  card,
  text,
  btn1Text,
  btn2Text,
  header,
  btn1Handler,
  removePopup,
}: PopupModelProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        removePopup();
      }}
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{text}</ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={() => {
              btn1Handler();
              onClose();
            }}
          >
            {btn1Text}
          </Button>
          <Button variant="blue" onClick={onClose}>
            {btn2Text}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PopupModal;
