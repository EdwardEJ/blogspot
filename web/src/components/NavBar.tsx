import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery();

	let body = null;

	//loading
	if (fetching) {
		//user is not logged in
	} else if (!data?.me) {
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

		//user is logged in
	} else {
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
		<Flex p={4} bg='tomato'>
			<Box ml={'auto'}>{body}</Box>
		</Flex>
	);
};
