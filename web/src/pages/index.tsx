import { DeleteIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Center,
	Flex,
	Heading,
	IconButton,
	Link,
	Stack,
	Text,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { UpvoteSection } from '../components/UpvoteSection';
import { useDeletePostMutation, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 15,
		cursor: null as string | null,
	});

	const [{ data, fetching }] = usePostsQuery({
		variables,
	});

	const [_, deletePost] = useDeletePostMutation();

	if (!fetching && !data) {
		<Box>Something went wrong</Box>;
	}

	return (
		<Layout>
			{!data ? (
				<p>Loading...</p>
			) : (
				<Stack spacing={8}>
					{data.posts.posts.map((p) =>
						!p ? null : (
							<Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
								<UpvoteSection post={p} />
								<Box flex={1}>
									<NextLink href='/post/[id]' as={`post/${p.id}`}>
										<Link>
											<Heading fontSize='xl'>{p.title}</Heading>
										</Link>
									</NextLink>
									<Text>Posted by: {p.creator.username}</Text>
									<Flex>
										<Text mt={4}>{p.textSnippet}</Text>
										<IconButton
											icon={<DeleteIcon />}
											aria-label='Delete Post'
											ml='auto'
											colorScheme='red'
											onClick={() => {
												console.log(p.id);
												deletePost({ id: p.id });
											}}></IconButton>
									</Flex>
								</Box>
							</Flex>
						)
					)}
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
