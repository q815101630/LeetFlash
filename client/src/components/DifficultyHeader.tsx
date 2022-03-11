import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import {
  DifficultyType,
  selectSettings,
  setDifficultyType,
} from "redux/settings/settingsSlice";

const DifficultyHeader = () => {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const difficultyType = settings.difficultyType;
  const onRadioChange = (value: DifficultyType) => {
    dispatch(setDifficultyType(value));
  };
  return (
    <Popover >
      <PopoverTrigger>
        <Button variant='ghost'>Difficulty: {difficultyType}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <RadioGroup onChange={onRadioChange} value={difficultyType}>
            <Stack direction="row">
              <Radio value={DifficultyType.ALL}>All</Radio>
              <Radio value={DifficultyType.EASY}>Easy</Radio>
              <Radio value={DifficultyType.MEDIUM}>Medium</Radio>
              <Radio value={DifficultyType.HARD}>Hard</Radio>
            </Stack>
          </RadioGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default DifficultyHeader;
