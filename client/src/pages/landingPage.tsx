import React, { useLayoutEffect, useRef } from 'react';
import { Box, Button, Flex, Heading, Image, Text, LightMode } from '@chakra-ui/react';

const LandingPage = () => {
  return (
    <Box minH="calc(100vh - 3rem)" bg="orange.500" px="2rem">
      <Flex
        direction={{ base: 'column', xl: 'row' }}
        pt={{ base: '8rem' }}
        align="center"
        justify={{ lg: 'space-between' }}
        gap={{ base: 14, xl: 0 }}
      >
        <Flex
          textAlign={{ base: 'center', xl: 'left' }}
          direction="column"
          flexGrow={5}
          align={{ base: 'center', xl: 'flex-start' }}
          gap={6}
        >
          <Heading
            fontSize={{ base: '4xl', md: '5xl' }}
            color="white"
            maxW={{ base: '35rem', lg: '45rem', xl: '50rem' }}
          >
            High Performat Servers tailored to your needs
          </Heading>
          <Text
            color="white"
            fontSize={{ base: 'sm', md: 'md', xl: 'lg' }}
            maxW={{ base: '32rem', md: '36rem', xl: '45rem' }}
            fontWeight="semibold"
          >
            Our cloud provisions the best servers, with fast SSD, powerful Xeon Processors, whenever
            you need it. Oh, and we have 99.9% SLA
          </Text>
          <LightMode>
            <Button
              variant="solid"
              colorScheme="blue"
              h={{ base: '3.5rem', xl: '4rem' }}
              w={{ base: '14rem', xl: '16rem' }}
              fontSize="md"
            >
              Start Your 15 Day Free Trial
            </Button>
          </LightMode>
        </Flex>
        <Box w={{ base: '36rem', xl: '100%' }} maxW="39rem" flexGrow={1} flexShrink={3} p={2}>
          <Image
            src="https://treact.owaiskhan.me/static/media/server-illustration-2.759ff537.svg"
            alt=""
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default LandingPage;
