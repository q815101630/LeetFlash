import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { Card } from "interfaces/interfaces";
import { useAppSelector } from "redux/hooks";
import { TableAction } from "./QuestionTableContainer";
import { selectUser } from "redux/user/userSlice";

export interface ActionConfirmationModelProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string[];
  tableAction: TableAction;
  confirmHandler: () => void;
  questions: Card[];
}
const ActionConfirmationModel = ({
  isOpen,
  onClose,
  selected,
  tableAction,
  confirmHandler,
  questions,
}: ActionConfirmationModelProps) => {
  const getHeaderText = () => {
    if (tableAction === TableAction.ACTIVATE) {
      return "Confirm to set following questions to active";
    } else if (tableAction === TableAction.ARCHIVE) {
      return "Confirm to archive following questions";
    } else if (tableAction === TableAction.DELETE) {
      return "Confirm to delete following questions";
    } else if (tableAction === TableAction.RESET) {
      return "Confirm to reset following questions to stage 1";
    }
  };
  const { lang } = useAppSelector(selectUser);

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{getHeaderText()}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {questions
            .filter((card) => selected.indexOf(card.id) > -1)
            .map((card, index) => (
              <Text key={`${card.id}-${index}`}>
                {card.question.questionId}.{" "}
                {lang === "EN"
                  ? card.question.title
                  : card.question.translatedTitle}
              </Text>
            ))}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={() => {
              confirmHandler();
              onClose();
            }}
          >
            Confirm
          </Button>
          <Button onClick={onClose} variant="blue">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ActionConfirmationModel;
