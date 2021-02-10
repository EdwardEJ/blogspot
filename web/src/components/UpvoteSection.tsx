import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
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
				icon={<ArrowUpIcon />}
				onClick={async () => {
					if (post.voteStatus === 1) {
						return;
					}
					setLoadingState('upvote-loading');
					await vote({
						postId: post.id,
						value: 1,
					});
					setLoadingState('not-loading');
				}}
				// isLoading={fetching && operation?.variables?.value === 1}
				isLoading={loadingState === 'upvote-loading'}
				colorScheme={post.voteStatus === 1 ? 'green' : undefined}
				aria-label='Upvote Post'
			/>
			{post.points}
			<IconButton
				icon={<ArrowDownIcon />}
				onClick={async () => {
					if (post.voteStatus === -1) {
						return;
					}
					setLoadingState('downvote-loading');
					await vote({
						postId: post.id,
						value: -1,
					});
					setLoadingState('not-loading');
				}}
				// isLoading={fetching && operation?.variables?.value === -1}
				isLoading={loadingState === 'downvote-loading'}
				colorScheme={post.voteStatus === -1 ? 'red' : undefined}
				aria-label='Downvote Post'
			/>
		</Flex>
	);
};
