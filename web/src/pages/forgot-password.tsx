import { Box, Center, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';

const ForgotPassword: React.FC<{}> = ({}) => {
	const router = useRouter();
	const [, forgotPassword] = useForgotPasswordMutation();
	const [complete, setComplete] = useState(false);
	return (
		<Layout variant='small'>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async (values) => {
					await forgotPassword(values);
					setComplete(true);
				}}>
				{({ isSubmitting }) =>
					complete ? (
						<Box>Reset password link was sent to your email</Box>
					) : (
						<Form>
							<Box mt={4}>
								<InputField
									name='email'
									placeholder='email'
									label='Email'
									type='email'
								/>
							</Box>
							<Center>
								<Button
									mt={4}
									type='submit'
									colorScheme='teal'
									isLoading={isSubmitting}>
									Forgot Password
								</Button>
							</Center>
						</Form>
					)
				}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
