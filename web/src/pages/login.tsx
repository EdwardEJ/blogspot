import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Center, Link } from '@chakra-ui/react';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { Layout } from '../components/Layout';

const Login: React.FC<{}> = ({}) => {
	const router = useRouter();
	const [_, login] = useLoginMutation();

	return (
		<Layout variant='small'>
			<Formik
				initialValues={{ usernameOrEmail: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login(values);
					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						if (typeof router.query.next === 'string') {
							router.push(router.query.next || '/');
						} else {
							router.push('/');
						}
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='usernameOrEmail'
							placeholder='username or email'
							label='Username or Email'
						/>
						<Box mt={4}>
							<InputField
								name='password'
								placeholder='password'
								label='Password'
								type='password'
							/>
						</Box>
						<Center mt={4}>
							<NextLink href='/forgot-password'>
								<Link>Forgot Password?</Link>
							</NextLink>
						</Center>
						<Center>
							<Button
								mt={4}
								type='submit'
								colorScheme='teal'
								isLoading={isSubmitting}>
								Login
							</Button>
						</Center>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(Login);
