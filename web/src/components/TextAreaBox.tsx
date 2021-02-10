import {
	FormControl,
	FormLabel,
	Textarea,
	FormErrorMessage,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { TextareaHTMLAttributes } from 'react';

type InputFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	name: string;
	label: string;
};

export const TextAreaBox: React.FC<InputFieldProps> = ({ label, ...props }) => {
	const [field, { error }] = useField(props);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<Textarea {...field} {...props} id={field.name} />
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
