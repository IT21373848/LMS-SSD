import { useState, useEffect } from 'react';
import * as Yup from 'yup';

export const useValidation = (schema: Yup.ObjectSchema<any>, values: any = {}) => {
  const [errorCollection, setErrorCollection] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(true);

  const validate = async (values: any) => {
    try {
      // Reset errors before validating
      setErrorCollection({});
      setIsValid(true);

      // Run the validation with `abortEarly: false` to capture all errors
      await schema.validate(values, { abortEarly: false });
      setIsValid(true); // Valid if no exceptions are thrown
    } catch (err) {
      setIsValid(false);

      if (err instanceof Yup.ValidationError) {
        // Collect errors from `err.inner` which contains all field-level errors
        const errors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          errors[error.path] = error.message;
        });

        // Set the error collection state
        setErrorCollection(errors);
      }
    }
  };

  // useEffect to validate whenever the values change
  useEffect(() => {
    validate(values); // Call validate function with new values
  }, [values]); // Re-run validation when values change

  return { isValid, errorCollection };
};
