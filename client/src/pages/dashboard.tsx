import { Flex, useColorModeValue } from '@chakra-ui/react';
import { QuestionTableContainer } from '../components/QuestionTableContainer';
import * as React from 'react';
import { fetchCards } from '../apis/data.api';

// see https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table
// to configure react-table typings

export const Dashboard = () => {
  const bg = useColorModeValue('gray.100', 'gray.800');

  React.useEffect(() => {
    const fetchData = async () => {
      const cards = await fetchCards();
      console.log(cards);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <Flex direction="row" justify="center" bg={bg} minH="calc(100vh - 4rem)">
      <QuestionTableContainer />
    </Flex>
  );
};
