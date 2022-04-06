import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { QuestionTableContainer } from '../components/QuestionTableContainer';
import * as React from 'react';
import { fetchCards } from '../apis/data.api';

// see https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table
// to configure react-table typings

export const Dashboard = () => {
  React.useEffect(() => {
    const fetchData = async () => {
      const cards = await fetchCards();
      console.log(cards);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <Flex direction="row" justify="center" pb={4}>
      <QuestionTableContainer />
    </Flex>
  );
};
