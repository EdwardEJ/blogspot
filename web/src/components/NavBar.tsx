import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isSever } from '../utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isSever(),
	});

	let body = null;

	if (fetching) {
		//loading
	} else if (!data?.me) {
		//user is not logged in
		body = (
			<>
				<NextLink href='/login'>
					<Link color='white' mr={2}>
						Login
					</Link>
				</NextLink>
				<NextLink href='/register'>
					<Link color='white'>Register</Link>
				</NextLink>
			</>
		);
	} else {
		//user is logged in
		body = (
			<Flex>
				<Box color='white' mr={4}>
					{data.me.username}
				</Box>
				<Button
					color='white'
					onClick={() => logout()}
					isLoading={logoutFetching}
					variant='link'>
					Logout
				</Button>
			</Flex>
		);
	}

	return (
		<Flex
			zIndex={1}
			position='sticky'
			top={0}
			p={4}
			bg='tomato'
			align='baseline'>
			<NextLink href='/'>
				<Link>
					<Heading>Blog Spot</Heading>
				</Link>
			</NextLink>
			<Box ml={'auto'}>{body}</Box>
		</Flex>
	);
};
