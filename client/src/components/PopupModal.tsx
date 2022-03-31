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
import { useAppSelector } from "redux/hooks";
import { selectSettings } from "redux/settings/settingsSlice";

export interface PopupModelProps {
  card: Card;
  removePopup: () => void;
}

const PopupModal = ({ card, removePopup }: PopupModelProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Modal
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
            {card.next_rep_date}
          </Button>
          <Button variant="ghost">Not confident? Review tomorrow!</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PopupModal;
