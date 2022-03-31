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
  removePopup: () => void;
}

const PopupModal = ({ card, removePopup }: PopupModelProps) => {
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
        <ModalHeader>Good job!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          You just completed {card.question.title}. When do you prefer to review
          for the next time?
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            {formatDate(card.next_rep_date)}
          </Button>
          <Button variant="ghost">Not sure? tomorrow again!</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PopupModal;
