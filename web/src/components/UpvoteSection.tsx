import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpvoteSectionProps {
	post: PostSnippetFragment;
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
	const [_, vote] = useVoteMutation();
	const [loadingState, setLoadingState] = useState<
		'upvote-loading' | 'downvote-loading' | 'not-loading'
	>('not-loading');

	return (
		<Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
			<IconButton
				onClick={async () => {
					setLoadingState('upvote-loading');
					await vote({
						postId: post.id,
						value: 1,
					});
					setLoadingState('not-loading');
				}}
				// isLoading={fetching && operation?.variables?.value === 1}
				isLoading={loadingState === 'upvote-loading'}
				colorScheme='teal'
				aria-label='Upvote Post'
				size='sm'
				icon={<ChevronUpIcon />}
			/>
			{post.points}
			<IconButton
				onClick={async () => {
					setLoadingState('downvote-loading');
					await vote({
						postId: post.id,
						value: -1,
					});
					setLoadingState('not-loading');
				}}
				// isLoading={fetching && operation?.variables?.value === -1}
				isLoading={loadingState === 'downvote-loading'}
				colorScheme='teal'
				aria-label='Downvote Post'
				size='sm'
				icon={<ChevronDownIcon />}
			/>
		</Flex>
	);
};