import { withUrqlClient } from 'next-urql';
import { NavBar } from '../components/NavBar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
	const [{ data }] = usePostsQuery();

	return (
		<>
			<NavBar />
			<div>Hello World</div>
			{!data ? 'Loading...' : data.posts.map((p) => <div>{p.title}</div>)}
		</>
	);
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);