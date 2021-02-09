import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import {
	Box,
	Button,
	Center,
	Flex,
	Heading,
	Link,
	Stack,
	Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: null as string | null,
	});

	const [{ data, fetching }] = usePostsQuery({
		variables,
	});

	if (!fetching && !data) {
		<Box>Something went wrong</Box>;
	}

	return (
		<Layout>
			<Flex align='baseline' mt={8} mb={8}>
				<Heading>Blog Spot</Heading>
				<NextLink href='/create-post'>
					<Link ml='auto'>Create Post</Link>
				</NextLink>
			</Flex>

			{!data ? (
				<p>Loading...</p>
			) : (
				<Stack spacing={8}>
					{data.posts.posts.map((p) => (
						<Box key={p.id} p={5} shadow='md' borderWidth='1px'>
							<Heading fontSize='xl'>{p.title}</Heading>
							<Text mt={4}>{p.textSnippet}</Text>
						</Box>
					))}
				</Stack>
			)}
			{data && data.posts.hasMore ? (
				<Center>
					<Button
						onClick={() =>
							setVariables({
								limit: variables.limit,
								cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
							})
						}
						isLoading={fetching}
						colorScheme='teal'
						m='auto'
						my={8}>
						Load More
					</Button>
				</Center>
			) : null}
		</Layout>
	);
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
