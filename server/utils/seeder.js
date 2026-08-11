const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Student = require('../models/Student');
const ExamRecord = require('../models/ExamRecord');

dotenv.config();

const sampleStudents = [
  {
    rollNo: 'STU-2026-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@techuni.edu',
    phone: '+91 98765 43210',
    institute: 'School of Computer Science',
    course: 'B.Tech Computer Science',
    status: 'Active',
    gender: 'Male',
    joinDate: new Date('2024-08-01'),
    address: 'Sector 62, Noida, Uttar Pradesh',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-102',
    name: 'Priya Patel',
    email: 'priya.patel@techuni.edu',
    phone: '+91 98123 76543',
    institute: 'School of Data Science',
    course: 'M.Sc Data Analytics',
    status: 'Active',
    gender: 'Female',
    joinDate: new Date('2024-08-15'),
    address: 'Koramangala, Bengaluru, Karnataka',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-103',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@techuni.edu',
    phone: '+91 99887 66554',
    institute: 'School of Computer Science',
    course: 'B.Tech Computer Science',
    status: 'Active',
    gender: 'Male',
    joinDate: new Date('2024-08-01'),
    address: 'Bandra West, Mumbai, Maharashtra',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-104',
    name: 'Ananya Verma',
    email: 'ananya.verma@techuni.edu',
    phone: '+91 97654 32109',
    institute: 'Institute of Information Tech',
    course: 'B.Sc Software Engineering',
    status: 'Active',
    gender: 'Female',
    joinDate: new Date('2024-09-01'),
    address: 'Connaught Place, New Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-105',
    name: 'Vikramaditya Singh',
    email: 'vikram.singh@techuni.edu',
    phone: '+91 91234 56789',
    institute: 'School of Artificial Intelligence',
    course: 'M.Tech Artificial Intelligence',
    status: 'Active',
    gender: 'Male',
    joinDate: new Date('2024-07-20'),
    address: 'Bani Park, Jaipur, Rajasthan',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-106',
    name: 'Sneha Roy',
    email: 'sneha.roy@techuni.edu',
    phone: '+91 93456 78901',
    institute: 'School of Data Science',
    course: 'M.Sc Data Analytics',
    status: 'Inactive',
    gender: 'Female',
    joinDate: new Date('2024-08-15'),
    address: 'Salt Lake City, Kolkata, West Bengal',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-107',
    name: 'Kabir Das',
    email: 'kabir.das@techuni.edu',
    phone: '+91 95432 10987',
    institute: 'Institute of Information Tech',
    course: 'B.Sc Cybersecurity',
    status: 'Active',
    gender: 'Male',
    joinDate: new Date('2024-09-10'),
    address: 'Jubilee Hills, Hyderabad, Telangana',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-108',
    name: 'Diya Nair',
    email: 'diya.nair@techuni.edu',
    phone: '+91 96543 21876',
    institute: 'School of Computer Science',
    course: 'B.Tech Computer Science',
    status: 'Active',
    gender: 'Female',
    joinDate: new Date('2024-08-01'),
    address: 'Kochi, Kerala',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-109',
    name: 'Aditya Kulkarni',
    email: 'aditya.kulkarni@techuni.edu',
    phone: '+91 98877 66112',
    institute: 'School of Artificial Intelligence',
    course: 'M.Tech Artificial Intelligence',
    status: 'Graduated',
    gender: 'Male',
    joinDate: new Date('2023-08-01'),
    address: 'Kothrud, Pune, Maharashtra',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-110',
    name: 'Meera Deshmukh',
    email: 'meera.d@techuni.edu',
    phone: '+91 94321 87654',
    institute: 'School of Data Science',
    course: 'M.Sc Data Analytics',
    status: 'Active',
    gender: 'Female',
    joinDate: new Date('2024-08-15'),
    address: 'Viman Nagar, Pune, Maharashtra',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-111',
    name: 'Tanya Joshi',
    email: 'tanya.joshi@techuni.edu',
    phone: '+91 92109 87654',
    institute: 'Institute of Information Tech',
    course: 'B.Sc Software Engineering',
    status: 'Active',
    gender: 'Female',
    joinDate: new Date('2024-09-01'),
    address: 'Dehradun, Uttarakhand',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80'
  },
  {
    rollNo: 'STU-2026-112',
    name: 'Siddharth Rao',
    email: 'siddharth.rao@techuni.edu',
    phone: '+91 97123 45678',
    institute: 'School of Computer Science',
    course: 'B.Tech Computer Science',
    status: 'Inactive',
    gender: 'Male',
    joinDate: new Date('2024-08-01'),
    address: 'Mylapore, Chennai, Tamil Nadu',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80'
  }
];

const examSubjects = [
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Web Engineering',
  'Computer Networks',
  'Operating Systems',
  'Machine Learning',
  'Cloud Computing'
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database records...');
    await User.deleteMany();
    await Student.deleteMany();
    await ExamRecord.deleteMany();

    // 1. Create Admin User
    const adminUser = await User.create({
      name: 'Dr. Sarah Jenkins (Admin)',
      email: 'admin@edu.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log(`Created Admin User: ${adminUser.email} / admin123`);

    // 2. Create Students
    const insertedStudents = await Student.insertMany(sampleStudents);
    console.log(`Created ${insertedStudents.length} Students.`);

    // 3. Create Exam Records for each student
    const examRecordsToInsert = [];

    insertedStudents.forEach((student) => {
      // Create 3 to 5 exams per student
      const numExams = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < numExams; i++) {
        const subject = examSubjects[i % examSubjects.length];
        const score = Math.floor(Math.random() * 45) + 55; // Score between 55 and 100
        const total = 100;
        const percentage = (score / total) * 100;

        let grade = 'A';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';
        else grade = 'F';

        const passStatus = percentage >= 50 ? 'Pass' : 'Fail';
        const daysAgo = Math.floor(Math.random() * 120);
        const examDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        examRecordsToInsert.push({
          student: student._id,
          examName: `Semester Assessment ${i + 1}`,
          subject,
          scoreObtained: score,
          totalMarks: total,
          grade,
          passStatus,
          examDate,
          remarks: passStatus === 'Pass' ? 'Good performance' : 'Remedial coaching recommended'
        });
      }
    });

    const insertedExams = await ExamRecord.insertMany(examRecordsToInsert);
    console.log(`Created ${insertedExams.length} Exam Records.`);

    console.log('Database Seeding Completed Successfully! 🎉');
    if (process.argv[2] === '-d') {
      process.exit();
    }
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
