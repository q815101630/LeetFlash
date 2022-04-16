import {
  Box,
  Container,
  Text,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  Divider,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { EditIcon, QuestionIcon } from '@chakra-ui/icons';
import { MarkdownPreview } from 'components/MarkdownPreview';

const problemDescription = `
<p>给定一个整数数组 <code>nums</code>&nbsp;和一个整数目标值 <code>target</code>，请你在该数组中找出 <strong>和为目标值 </strong><em><code>target</code></em>&nbsp; 的那&nbsp;<strong>两个</strong>&nbsp;整数，并返回它们的数组下标。</p>

<p>你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。</p>

<p>你可以按任意顺序返回答案。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [2,7,11,15], target = 9
<strong>输出：</strong>[0,1]
<strong>解释：</strong>因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums = [3,2,4], target = 6
<strong>输出：</strong>[1,2]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>nums = [3,3], target = 6
<strong>输出：</strong>[0,1]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><strong>只会存在一个有效答案</strong></li>
</ul>

<ul>
	<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><strong>只会存在一个有效答案</strong></li>
</ul>
<ul>
	<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><strong>只会存在一个有效答案</strong></li>
</ul>
<ul>
	<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><strong>只会存在一个有效答案</strong></li>
</ul>

<p><strong>进阶：</strong>你可以想出一个时间复杂度小于 <code>O(n<sup>2</sup>)</code> 的算法吗？</p>
`;

const DailyReview = () => {
  const bg = useColorModeValue('gray.100', 'gray.800');
  const coontainerBg = useColorModeValue('white', 'gray.700');

  return (
    <Flex w="full">
      <Container maxW="container.xl">
        <Stack spacing={2} py={6}>
          <Heading size="lg" fontWeight="medium">
            Daily Review
          </Heading>
          <Text>View problems need to be reviewed</Text>
          <Divider bgColor={useColorModeValue('gray.300', 'gray.700')} />
        </Stack>
        <SimpleGrid
          rounded="md"
          columns={{ base: 1, xl: 2 }}
          boxShadow={useColorModeValue('lg', 'lg-dark')}
          bg={coontainerBg}
          mb={10}
        >
          <Flex h="75vh">
            <Flex p={4} direction="column" minW="full" gap={4}>
              <HStack>
                <QuestionIcon />
                <Heading as="h2" fontWeight="semibold" size="md">
                  Problem
                </Heading>
              </HStack>
              <Flex minW="full" className="overflow-y-scroll relative">
                <Text dangerouslySetInnerHTML={{ __html: problemDescription }}></Text>
              </Flex>
            </Flex>
            <Divider
              orientation={useBreakpointValue({ base: 'horizontal', xl: 'vertical' })}
            ></Divider>
          </Flex>
          <Flex p={4} direction="column" gap={4} h="75vh">
            <HStack>
              <EditIcon />
              <Heading as="h2" fontWeight="semibold" size="md">
                Note
              </Heading>
            </HStack>
            <Box className="overflow-y-scroll relative">
              <MarkdownPreview />
            </Box>
          </Flex>
        </SimpleGrid>
      </Container>
    </Flex>
  );
};

export default DailyReview;
