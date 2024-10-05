import * as Yup from 'yup';

export const StudentSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    gender: Yup.string().required('Gender is required'),
    contactNo: Yup.string()
      .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits')
      .required('Contact Number is required'),
    dob: Yup.date()
      .required('Date of Birth is required')
      .max(new Date(), 'Date of Birth cannot be in the future'),
    parentEmail: Yup.string().email('Invalid email').required('Parent Email is required'),
    email: Yup.string().email('Invalid email').required('Student Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
               'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
      .required('Password is required'),
    classId: Yup.string().required('Class is required'),
  });
