import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import React from 'react';

const Index = () => {
	const [{ data }] = usePostsQuery();

	return (
		<Layout>
			<NextLink href='/create-post'>
				<Link>Create Post</Link>
			</NextLink>
			<div>Home Page</div>
			{!data
				? 'Loading...'
				: data.posts.map((p) => <div key={p.title}>{p.title}</div>)}
		</Layout>
	);
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
