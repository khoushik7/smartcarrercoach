const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Question = require('../models/Question');
const connectDB = require('../config/db');

const seedAll = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Question.deleteMany({});

    console.log('Seeding demo users...');
    const salt = await bcrypt.genSalt(10);
    const studentPassword = await bcrypt.hash('student123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);

    const studentUser = await User.create({
      name: 'Alex Johnson',
      email: 'student@smartcareer.com',
      password: studentPassword,
      role: 'student',
      college: 'National Institute of Technology',
      degree: 'B.Tech Computer Science',
      graduationYear: 2026,
      targetRole: 'Full Stack Engineer',
      skills: ['Java', 'React', 'Data Structures', 'SQL'],
      placementReadinessScore: 78,
      totalInterviews: 4,
      avgHrScore: 82,
      avgTechScore: 76,
      avgAptitudeScore: 80,
      avgCommunicationScore: 75,
      dailyStreak: 5
    });

    const adminUser = await User.create({
      name: 'Dr. Sarah Connor (Placement Head)',
      email: 'admin@smartcareer.com',
      password: adminPassword,
      role: 'admin',
      college: 'Smart Placement Office',
      degree: 'M.Tech, Ph.D CS',
      graduationYear: 2018,
      targetRole: 'Placement Officer'
    });

    console.log('Seeding HR Questions...');
    const hrQuestions = [
      {
        moduleType: 'HR',
        category: 'Behavioral',
        difficulty: 'Intermediate',
        title: 'Tell me about yourself.',
        description: 'Provide a structured introduction highlighting your academic background, core technical skills, key projects, and career aspirations.',
        sampleAnswer: 'I am a final year Computer Science student passionate about software development. During my studies, I built a web application using React and Node.js that streamlined campus event management. My core strengths lie in Java, Data Structures, and relational databases. I am looking to kickstart my career in an innovative tech environment where I can contribute to scalable solutions.',
        keyPointsToCover: ['Academic degree & graduation year', 'Top 2-3 technical skills', 'Highlight of a major project', 'Why you are excited about this role']
      },
      {
        moduleType: 'HR',
        category: 'Behavioral',
        difficulty: 'Intermediate',
        title: 'What are your greatest strengths and weaknesses?',
        description: 'Be honest and demonstrate self-awareness while showcasing how you work on self-improvement.',
        sampleAnswer: 'My primary strength is analytical problem-solving and rapid learning of new frameworks. For instance, I picked up React in 2 weeks for a hackathon. As for weakness, I used to struggle with delegating tasks in group projects because I wanted everything perfect, but I have learned to trust team members and use agile task boards to track progress.',
        keyPointsToCover: ['Concrete professional strength with example', 'Genuine weakness being actively improved', 'Self-awareness and growth mindset']
      },
      {
        moduleType: 'HR',
        category: 'Behavioral',
        difficulty: 'Intermediate',
        title: 'Why should we hire you?',
        description: 'Align your skillset and attitude with the company value proposition.',
        sampleAnswer: 'You should hire me because I combine strong technical fundamentals in algorithms and web development with a proven drive for continuous learning. My recent internship project reduced API response times by 20%. I am dedicated, adapt quickly to team workflows, and am eager to deliver immediate value.',
        keyPointsToCover: ['Matching technical competency', 'Specific value or result produced in past project', 'Enthusiasm and cultural fit']
      },
      {
        moduleType: 'HR',
        category: 'Behavioral',
        difficulty: 'Beginner',
        title: 'Where do you see yourself in 3 to 5 years?',
        description: 'Demonstrate ambition aligned with realistic engineering growth.',
        sampleAnswer: 'In 3 years, I see myself as a seasoned Senior Software Engineer leading core feature developments, mentoring junior team members, and mastering cloud architecture to build resilient systems.',
        keyPointsToCover: ['Technical growth trajectory', 'Desire to take on ownership and mentorship', 'Long-term commitment']
      },
      {
        moduleType: 'HR',
        category: 'Behavioral',
        difficulty: 'Advanced',
        title: 'Describe a situation where you faced a conflict in a team and how you resolved it.',
        description: 'Use the STAR technique (Situation, Task, Action, Result).',
        sampleAnswer: 'During our final year capstone project, two team members disagreed on using MongoDB vs PostgreSQL. I scheduled a quick benchmarking session where we evaluated schema flexibility requirements and team familiarity. Based on data, we collectively agreed on PostgreSQL for its relational consistency. The project was completed 3 days ahead of deadline.',
        keyPointsToCover: ['Clear STAR methodology', 'Objective data-driven resolution', 'Maintaining team harmony']
      }
    ];

    await Question.insertMany(hrQuestions);

    console.log('Seeding Technical Questions (10 Categories)...');
    const techQuestions = [
      // Java
      {
        moduleType: 'TECHNICAL',
        category: 'Java',
        difficulty: 'Beginner',
        title: 'What is the difference between String, StringBuilder, and StringBuffer in Java?',
        options: [
          'String is immutable, StringBuilder is mutable & non-thread safe, StringBuffer is mutable & thread-safe.',
          'String is mutable, StringBuilder is immutable.',
          'All three are identical in memory and thread safety.',
          'StringBuffer is faster than StringBuilder in single-threaded environments.'
        ],
        correctOptionIndex: 0,
        explanation: 'String objects are immutable in Java. StringBuilder allows dynamic string manipulation without thread-safety overhead, whereas StringBuffer synchronizes methods for multi-threaded safety.',
        codeSnippet: 'String s = "Hello"; // Immutable\nStringBuilder sb = new StringBuilder("Hello"); // Mutable'
      },
      {
        moduleType: 'TECHNICAL',
        category: 'Java',
        difficulty: 'Intermediate',
        title: 'What happens when an exception occurs inside a try block with a return statement and a finally block?',
        options: [
          'The try return statement executes and finally block is skipped.',
          'The finally block executes before the method actually returns.',
          'The program terminates immediately with a runtime crash.',
          'The compiler raises a syntax error.'
        ],
        correctOptionIndex: 1,
        explanation: 'The finally block always executes regardless of whether an exception occurs or a return statement is encountered in try/catch.',
        codeSnippet: 'try {\n  return 1;\n} finally {\n  System.out.println("Finally runs!");\n}'
      },
      // Python
      {
        moduleType: 'TECHNICAL',
        category: 'Python',
        difficulty: 'Beginner',
        title: 'What is the difference between list append() and extend() in Python?',
        options: [
          'append() adds an element as a single item; extend() iterates over its argument adding each element.',
          'extend() adds an element to the start; append() adds to the end.',
          'append() creates a copy; extend() mutates in place.',
          'They perform identical operations.'
        ],
        correctOptionIndex: 0,
        explanation: 'a.append([1,2]) yields [..., [1,2]], whereas a.extend([1,2]) yields [..., 1, 2].',
        codeSnippet: 'lst = [1, 2]\nlst.append([3, 4]) # [1, 2, [3, 4]]\nlst.extend([5, 6]) # [1, 2, [3, 4], 5, 6]'
      },
      // C Programming
      {
        moduleType: 'TECHNICAL',
        category: 'C Programming',
        difficulty: 'Intermediate',
        title: 'What is a dangling pointer in C?',
        options: [
          'A pointer pointing to a memory location that has been deallocated/freed.',
          'A pointer initialized to NULL.',
          'A pointer that points to a function address.',
          'A pointer stored inside static memory.'
        ],
        correctOptionIndex: 0,
        explanation: 'A dangling pointer arises when dynamic memory allocated via malloc/calloc is freed via free(), but the pointer variable still references that memory address.',
        codeSnippet: 'int *ptr = (int *)malloc(sizeof(int));\nfree(ptr);\n// ptr is now a dangling pointer'
      },
      // Data Structures
      {
        moduleType: 'TECHNICAL',
        category: 'Data Structures',
        difficulty: 'Intermediate',
        title: 'What is the worst-case time complexity of searching in a Hash Table?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
        correctOptionIndex: 2,
        explanation: 'Average time complexity of Hash Table lookup is O(1). However, in worst case when all keys collide into the same bucket (linked list chain), lookup degrades to O(N).',
        codeSnippet: 'hashTable.get(key); // Avg O(1), Worst O(N) on high collisions'
      },
      // Algorithms
      {
        moduleType: 'TECHNICAL',
        category: 'Algorithms',
        difficulty: 'Advanced',
        title: 'Which algorithmic paradigm does Dijkstra shortest path algorithm use?',
        options: ['Dynamic Programming', 'Greedy Approach', 'Divide and Conquer', 'Backtracking'],
        correctOptionIndex: 1,
        explanation: 'Dijkstra algorithm uses a Greedy strategy by repeatedly selecting the unvisited vertex with the minimum tentative distance.',
        codeSnippet: 'priority_queue<pair<int,int>> pq; // Greedy selection'
      },
      // DBMS
      {
        moduleType: 'TECHNICAL',
        category: 'DBMS',
        difficulty: 'Intermediate',
        title: 'What are ACID properties in Database Management Systems?',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Access, Control, Indexing, Data',
          'Algorithm, Code, Interface, Database',
          'Async, Concurrent, Isolated, Distributed'
        ],
        correctOptionIndex: 0,
        explanation: 'ACID guarantees that database transactions are processed reliably: Atomicity (all or nothing), Consistency (valid state), Isolation (independent execution), Durability (persisted on disk).',
        codeSnippet: 'BEGIN TRANSACTION;\n-- queries\nCOMMIT;'
      },
      // Operating Systems
      {
        moduleType: 'TECHNICAL',
        category: 'Operating Systems',
        difficulty: 'Intermediate',
        title: 'What are the four necessary conditions for Deadlock to occur?',
        options: [
          'Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait',
          'Paging, Segmentation, Swapping, Thrashing',
          'Read, Write, Execute, Delete',
          'User mode, Kernel mode, Interrupt, Trap'
        ],
        correctOptionIndex: 0,
        explanation: 'Deadlock can arise if and only if Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait conditions hold simultaneously.',
        codeSnippet: 'Thread 1 holds A, waits for B.\nThread 2 holds B, waits for A. (Circular Wait)'
      },
      // Computer Networks
      {
        moduleType: 'TECHNICAL',
        category: 'Computer Networks',
        difficulty: 'Beginner',
        title: 'Which layer of the OSI model does TCP and UDP operate at?',
        options: ['Network Layer', 'Transport Layer', 'Data Link Layer', 'Application Layer'],
        correctOptionIndex: 1,
        explanation: 'TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) operate at Layer 4: Transport Layer of OSI model.',
        codeSnippet: 'OSI Layer 4: Transport (TCP / UDP port numbers)'
      },
      // OOP Concepts
      {
        moduleType: 'TECHNICAL',
        category: 'OOP Concepts',
        difficulty: 'Beginner',
        title: 'What is Polymorphism in Object-Oriented Programming?',
        options: [
          'The ability of an object or method to take many forms (Method Overloading & Overriding).',
          'Hiding implementation details behind public interfaces.',
          'Bundling data and methods into a single unit.',
          'Deriving new classes from existing parent classes.'
        ],
        correctOptionIndex: 0,
        explanation: 'Polymorphism allows static (compile-time overloading) and dynamic (runtime method overriding) polymorphism.',
        codeSnippet: 'Shape s = new Circle();\ns.draw(); // Calls Circle draw implementation'
      },
      // Web Development
      {
        moduleType: 'TECHNICAL',
        category: 'Web Development',
        difficulty: 'Intermediate',
        title: 'What is the virtual DOM in React and why is it fast?',
        options: [
          'A lightweight in-memory copy of the real DOM used to compute diffs and batch updates efficiently.',
          'Direct manipulation of browser C++ DOM nodes.',
          'A web browser extension for rendering CSS animations.',
          'A server-side database cache engine.'
        ],
        correctOptionIndex: 0,
        explanation: 'React compares the virtual DOM with a snapshot of previous state via diffing (reconciliation algorithm), executing minimal layout repaints on the real DOM.',
        codeSnippet: 'const element = <h1>Hello World</h1>; // Virtual DOM node'
      }
    ];

    await Question.insertMany(techQuestions);

    console.log('Seeding Aptitude Questions (11 Topics)...');
    const aptitudeQuestions = [
      {
        moduleType: 'APTITUDE',
        category: 'Percentages',
        topic: 'Percentages',
        difficulty: 'Beginner',
        title: 'If 20% of a number is equal to 50, what is 40% of that same number?',
        options: ['100', '120', '150', '200'],
        correctOptionIndex: 0,
        explanation: 'Step 1: Let the number be X.\n0.20 * X = 50 => X = 50 / 0.20 = 250.\nStep 2: 40% of 250 = 0.40 * 250 = 100.'
      },
      {
        moduleType: 'APTITUDE',
        category: 'Ratio and Proportion',
        topic: 'Ratio and Proportion',
        difficulty: 'Beginner',
        title: 'The ratio of two numbers is 3:5. If their sum is 240, find the larger number.',
        options: ['90', '120', '150', '160'],
        correctOptionIndex: 2,
        explanation: 'Step 1: Total parts = 3 + 5 = 8 parts.\nStep 2: Value of 1 part = 240 / 8 = 30.\nStep 3: Larger number = 5 parts = 5 * 30 = 150.'
      },
      {
        moduleType: 'APTITUDE',
        category: 'Profit and Loss',
        topic: 'Profit and Loss',
        difficulty: 'Intermediate',
        title: 'A trader sells an article at $800 making a profit of 25%. What was the cost price of the article?',
        options: ['$600', '$640', '$650', '$700'],
        correctOptionIndex: 1,
        explanation: 'Step 1: Selling Price (SP) = Cost Price (CP) * (1 + Profit% / 100).\n800 = CP * (1 + 0.25) => 800 = 1.25 * CP.\nStep 2: CP = 800 / 1.25 = $640.'
      },
      {
        moduleType: 'APTITUDE',
        category: 'Average',
        topic: 'Average',
        difficulty: 'Beginner',
        title: 'The average mark of 5 students in an exam is 70. If a 6th student scoring 94 joins, what is the new average?',
        options: ['72', '74', '75', '76'],
        correctOptionIndex: 1,
        explanation: 'Step 1: Total sum of 5 students = 5 * 70 = 350.\nStep 2: New sum with 6th student = 350 + 94 = 444.\nStep 3: New average = 444 / 6 = 74.'
      },
      {
        moduleType: 'APTITUDE',
        category: 'Time and Work',
        topic: 'Time and Work',
        difficulty: 'Intermediate',
        title: 'A can complete a project in 10 days and B in 15 days. Working together, how many days will they take to complete the project?',
        options: ['5 days', '6 days', '7.5 days', '8 days'],
        correctOptionIndex: 1,
        explanation: 'Step 1: 1 day work of A = 1/10.\nStep 2: 1 day work of B = 1/15.\nStep 3: Combined 1 day work = 1/10 + 1/15 = 5/30 = 1/6.\nStep 4: Total days required = 6 days.'
      },
      {
        moduleType: 'APTITUDE',
        category: 'Time Speed Distance',
        topic: 'Time Speed Distance',
        difficulty: 'Intermediate',
        title: 'A train running at a speed of 72 km/h crosses a 200m long platform in 20 seconds. What is the length of the train?',
        options: ['150 m', '200 m', '250 m', '300 m'],
        correctOptionIndex: 1,
        explanation: 'Step 1: Convert speed to m/s: 72 * (5/18) = 20 m/s.\nStep 2: Total distance covered = Speed * Time = 20 * 20 = 400 m.\nStep 3: Total distance = Length of train (L) + Platform length (200m).\nL + 200 = 400 => L = 200m.'
      },
      {
        moduleType: 'APTITUDE',
        category: 'Number System',
        topic: 'Number System',
        difficulty: 'Beginner',
        title: 'What is the unit digit of (3^65)?',
        options: ['1', '3', '7', '9'],
        correctOptionIndex: 1,
        explanation: 'Step 1: Cyclicity of powers of 3 is 4 (3, 9, 7, 1).\nStep 2: Divide power by 4: 65 % 4 = 1 remainder.\nStep 3: 3^1 = 3.'
      },
      {
        moduleType: 'APTITUDE',
        category: 'Probability',
        topic: 'Probability',
        difficulty: 'Intermediate',
        title: 'Two dice are rolled simultaneously. What is the probability of getting a sum of 8?',
        options: ['5/36', '1/6', '7/36', '1/9'],
        correctOptionIndex: 0,
        explanation: 'Step 1: Total outcomes = 6 * 6 = 36.\nStep 2: Favorable pairs for sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) => 5 outcomes.\nStep 3: Probability = 5/36.'
      },
      {
        moduleType: 'APTITUDE',
        category: 'Permutation and Combination',
        topic: 'Permutation and Combination',
        difficulty: 'Advanced',
        title: 'In how many ways can the letters of the word "SMART" be arranged?',
        options: ['60', '120', '240', '720'],
        correctOptionIndex: 1,
        explanation: 'The word "SMART" has 5 distinct letters.\nNumber of arrangements = 5! = 5 * 4 * 3 * 2 * 1 = 120.'
      },
      {
        moduleType: 'APTITUDE',
        category: 'Data Interpretation',
        topic: 'Data Interpretation',
        difficulty: 'Intermediate',
        title: 'In a company of 500 employees, 60% are engineers, 25% are managers, and the rest are HR. How many HR employees are there?',
        options: ['65', '75', '85', '100'],
        correctOptionIndex: 1,
        explanation: 'Step 1: Percentage of HR = 100% - (60% + 25%) = 15%.\nStep 2: Number of HR = 15% of 500 = 0.15 * 500 = 75.'
      },
      {
        moduleType: 'APTITUDE',
        category: 'Logical Reasoning',
        topic: 'Logical Reasoning',
        difficulty: 'Beginner',
        title: 'Find the next number in the series: 3, 6, 12, 24, 48, ?',
        options: ['60', '72', '96', '108'],
        correctOptionIndex: 2,
        explanation: 'The series follows a multiplication pattern by 2: 3*2=6, 6*2=12, 12*2=24, 24*2=48, 48*2=96.'
      }
    ];

    await Question.insertMany(aptitudeQuestions);

    console.log('Seeding Company Prep Question Sets...');
    const companyQuestions = [
      {
        moduleType: 'COMPANY',
        category: 'TCS NQT',
        company: 'TCS',
        difficulty: 'Intermediate',
        title: 'TCS NQT Technical: Find the second smallest element in an array without sorting.',
        description: 'Common TCS NQT coding & technical interview question.',
        options: [
          'Track smallest and second smallest variables in a single O(N) pass.',
          'Sort array using QuickSort in O(N log N).',
          'Use two nested loops in O(N^2).',
          'Convert array to binary tree.'
        ],
        correctOptionIndex: 0,
        explanation: 'In a single traversal, update min1 and min2 when iterating through elements.',
        codeSnippet: 'int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE;\nfor(int val : arr) {\n  if(val < min1) { min2 = min1; min1 = val; }\n  else if(val < min2 && val != min1) min2 = val;\n}'
      },
      {
        moduleType: 'COMPANY',
        category: 'Infosys InfyTQ',
        company: 'Infosys',
        difficulty: 'Intermediate',
        title: 'Infosys Pseudocode: What will be the output of a loop executing i=1 to 10 with step i = i * 2?',
        options: ['1, 2, 4, 8', '1, 3, 5, 7, 9', '2, 4, 6, 8, 10', '1, 2, 3, 4, 5'],
        correctOptionIndex: 0,
        explanation: 'i starts at 1. Next iterations: 1*2=2, 2*2=4, 4*2=8. Next is 16 which exceeds 10.',
        codeSnippet: 'for (int i = 1; i <= 10; i = i * 2) {\n  print(i);\n}'
      },
      {
        moduleType: 'COMPANY',
        category: 'Wipro NLTH',
        company: 'Wipro',
        difficulty: 'Beginner',
        title: 'Wipro Verbal & HR: Choose the correct preposition: "The team is confident ___ winning the placement drive."',
        options: ['of', 'in', 'for', 'with'],
        correctOptionIndex: 0,
        explanation: 'The adjective "confident" takes the preposition "of" ("confident of winning").',
        codeSnippet: 'Correct: "confident of winning"'
      },
      {
        moduleType: 'COMPANY',
        category: 'Accenture ASE',
        company: 'Accenture',
        difficulty: 'Intermediate',
        title: 'Accenture Cloud & Tech: What is the main characteristic of Serverless Computing (e.g. AWS Lambda)?',
        options: [
          'Automatic scaling without managing underlying server instances.',
          'Physical servers managed in on-premise datacenter by developer.',
          'Serverless functions run continuously 24/7 without idle timeouts.',
          'Requires manual OS security patching.'
        ],
        correctOptionIndex: 0,
        explanation: 'Serverless computing abstracts server management; execution is event-driven and scales automatically.',
        codeSnippet: 'AWS Lambda execution (Pay per execution time)'
      }
    ];

    await Question.insertMany(companyQuestions);

    console.log('Seed database completed successfully!');
    console.log('Demo Credentials:');
    console.log('Student: student@smartcareer.com / student123');
    console.log('Admin:   admin@smartcareer.com   / admin123');
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

// Allow standalone execution via node seed/seedData.js
if (require.main === module) {
  seedAll().then(() => process.exit(0));
}

module.exports = seedAll;
