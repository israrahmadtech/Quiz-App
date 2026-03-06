import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup.string().min(2, 'Min 2 chars').max(50, 'Max 50 chars').required('Name required'),
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6, 'Min 6 chars')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, number')
    .required('Password required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().required('Password required'),
});

export const quizSchema = yup.object({
  title: yup.string().min(3).max(100).required('Title required'),
  description: yup.string().min(10).max(1000).required('Description required'),
  category: yup.string().required('Category required'),
  difficulty: yup.string().oneOf(['Easy','Medium','Hard']).required(),
  timeLimit: yup.number().min(1).max(120).required('Time limit required'),
});
