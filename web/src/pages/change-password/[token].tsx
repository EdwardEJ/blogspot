import React, { useState } from 'react';
import { Box, Button, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
	const router = useRouter();
	const [_, changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState('');
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ newPassword: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({
						newPassword: values.newPassword,
						token,
					});
					if (response.data?.changePassword.errors) {
						const errorMap = toErrorMap(response.data.changePassword.errors);
						if ('token' in errorMap) {
							setTokenError(errorMap.token);
						}
						setErrors(errorMap);
					} else if (response.data?.changePassword.user) {
						router.push('/login');
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='newPassword'
							placeholder='new password'
							type='password'
							label='New Password'
						/>
						<Box>
							<Box>
								{tokenError ? <Box color='red'>{tokenError}</Box> : null}
							</Box>
							<NextLink href='/forgot-password'>
								<Link>Forgot Password?</Link>
							</NextLink>
						</Box>
						<Button
							mt={4}
							type='submit'
							colorScheme='teal'
							isLoading={isSubmitting}>
							Change Password
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

ChangePassword.getInitialProps = ({ query }) => {
	return {
		token: query.token as string,
	};
};

export default withUrqlClient(createUrqlClient)(ChangePassword as any);