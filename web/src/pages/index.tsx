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
import { UpvoteSection } from '../components/UpvoteSection';

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 15,
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
				<NextLink href='/create-post'>
					<Link ml='auto'>Create Post</Link>
				</NextLink>
			</Flex>

			{!data ? (
				<p>Loading...</p>
			) : (
				<Stack spacing={8}>
					{data.posts.posts.map((p) => (
						<Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
							<UpvoteSection post={p} />
							<Box>
								<NextLink href='/post/[id]' as={`post/${p.id}`}>
									<Link>
										<Heading fontSize='xl'>{p.title}</Heading>
									</Link>
								</NextLink>
								<Text>Posted by: {p.creator.username}</Text>
								<Text mt={4}>{p.textSnippet}</Text>
							</Box>
						</Flex>
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
