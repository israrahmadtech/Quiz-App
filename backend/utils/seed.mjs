import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import User from '../models/User.mjs';
import Quiz from '../models/Quiz.mjs';
import Question from '../models/Question.mjs';
import connectDB from '../config/db.mjs';

console.log(process.env.MONGODB_URI);

const seed = async () => {
  await connectDB()
  console.log('Connected to DB');

  await User.deleteMany({});
  await Quiz.deleteMany({});
  await Question.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@quizapp.com',
    password: 'Admin@123',
    role: 'admin',
  });
  console.log('✅ Admin created: admin@quizapp.com / Admin@123');

  const user = await User.create({
    name: 'Test User',
    email: 'user@quizapp.com',
    password: 'User@123',
    role: 'user',
  });
  console.log('✅ User created: user@quizapp.com / User@123');

  const quiz = await Quiz.create({
    title: 'JavaScript Fundamentals',
    description: 'Test your JavaScript knowledge with this comprehensive quiz.',
    category: 'Technology',
    difficulty: 'Medium',
    timeLimit: 10,
    createdBy: admin._id,
    isPublished: true,
  });

  const questions = [
    { quizId: quiz._id, questionText: 'What is the output of typeof null?', options: ['"null"', '"object"', '"undefined"', '"string"'], correctAnswer: 1, order: 1 },
    { quizId: quiz._id, questionText: 'Which method converts JSON to a JS object?', options: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.objectify()'], correctAnswer: 1, order: 2 },
    { quizId: quiz._id, questionText: 'What does === check in JavaScript?', options: ['Value only', 'Type only', 'Value and type', 'Reference'], correctAnswer: 2, order: 3 },
    { quizId: quiz._id, questionText: 'What is a closure in JavaScript?', options: ['A loop construct', 'A function with access to its outer scope', 'An error handler', 'A module pattern'], correctAnswer: 1, order: 4 },
    { quizId: quiz._id, questionText: 'Which keyword declares a block-scoped variable?', options: ['var', 'int', 'let', 'define'], correctAnswer: 2, order: 5 },
  ];

  await Question.insertMany(questions);
  await Quiz.findByIdAndUpdate(quiz._id, { totalQuestions: questions.length });
  console.log('✅ Sample quiz with', questions.length, 'questions created');

  await mongoose.disconnect();
  console.log('🎉 Seeding complete!');
};

seed().catch(err => { console.error(err); process.exit(1); });
