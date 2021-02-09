import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Center } from '@chakra-ui/react';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/Layout';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
	const router = useRouter();
	const [_, register] = useRegisterMutation();

	return (
		<Layout variant='small'>
			<Formik
				initialValues={{ email: '', username: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register({ options: values });
					if (response.data?.register.errors) {
						setErrors(toErrorMap(response.data.register.errors));
					} else if (response.data?.register.user) {
						router.push('/');
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='username'
							placeholder='username'
							label='Username'
						/>
						<Box mt={4}>
							<InputField name='email' placeholder='email' label='Email' />
						</Box>
						<Box mt={4}>
							<InputField
								name='password'
								placeholder='password'
								label='Password'
								type='password'
							/>
						</Box>
						<Center>
							<Button
								mt={4}
								type='submit'
								colorScheme='teal'
								isLoading={isSubmitting}>
								Register
							</Button>
						</Center>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(Register);
