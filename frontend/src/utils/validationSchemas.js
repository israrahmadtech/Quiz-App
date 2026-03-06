import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name too long').required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

export const loginSchema = yup.object({
  email:    yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const quizSchema = yup.object({
  title:       yup.string().trim().min(3, 'Min 3 characters').max(100, 'Max 100 characters').required('Title is required'),
  description: yup.string().trim().max(500, 'Max 500 characters').required('Description is required'),
  category:    yup.string().required('Category is required'),
  difficulty:  yup.string().oneOf(['Easy', 'Medium', 'Hard']).required('Difficulty is required'),
  timeLimit:   yup.number().min(1, 'Min 1 minute').max(120, 'Max 120 minutes').required('Time limit is required'),
});

export const questionSchema = yup.object({
  questionText:  yup.string().trim().min(5, 'Min 5 characters').required('Question text is required'),
  optionA:       yup.string().trim().required('Option A is required'),
  optionB:       yup.string().trim().required('Option B is required'),
  optionC:       yup.string().trim().required('Option C is required'),
  optionD:       yup.string().trim().required('Option D is required'),
  correctAnswer: yup.string().oneOf(['A', 'B', 'C', 'D']).required('Select correct answer'),
  explanation:   yup.string().trim(),
});
