/**
 * Career Roadmaps & First Preparation Priorities
 * Sniffed out by Barkley the AI Career Pup 🐶
 */

export const POPULAR_ROLES = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    shortDesc: 'React, JavaScript, UI/UX & Web Performance',
    icon: '💻',
    tag: 'High Demand',
    prepareFirst: {
      stepNumber: 1,
      headline: 'JavaScript Engine, DOM & React Fundamentals',
      path: '/technical-prep?category=Web%20Development',
      buttonText: 'Start Web Dev & JS Practice',
      badge: 'Technical Round Qualifier',
      whyFirst: 'Frontend interviewers almost always kick off with JavaScript fundamentals (closures, event loop, Promises, ES6+) and component lifecycle before testing complex system design.',
      keySkills: ['JavaScript (ES6+, Closures, Async/Await)', 'React Hooks & State Management', 'DOM Manipulation & CSS Flex/Grid', 'REST APIs & Fetch'],
      timeEstimate: 'First 5 - 7 Days',
      targetCategory: 'Web Development'
    },
    roadmap: [
      {
        step: 1,
        title: 'Core JS & Web Dev Practice',
        page: '/technical-prep?category=Web%20Development',
        description: 'Practice high-frequency frontend coding problems and conceptual questions.',
        isFirst: true
      },
      {
        step: 2,
        title: 'Optimize Resume for Frontend Keywords',
        page: '/resume-analyzer',
        description: 'Ensure your resume showcases live demo links, GitHub repos, and React/TypeScript keywords.'
      },
      {
        step: 3,
        title: 'Mock Technical & HR Interview',
        page: '/mock-interview?type=Technical',
        description: 'Simulate live coding explanations and behavioral HR scenarios with voice analysis.'
      }
    ]
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    shortDesc: 'Java / Python, DSA, Databases & APIs',
    icon: '⚙️',
    tag: 'Core Engineering',
    prepareFirst: {
      stepNumber: 1,
      headline: 'Data Structures & Algorithms (DSA)',
      path: '/technical-prep?category=Data%20Structures',
      buttonText: 'Start DSA & Algorithms Practice',
      badge: 'Crucial Gatekeeper Round',
      whyFirst: 'Nearly 90% of backend engineering roles screen candidates via an initial LeetCode/DSA coding assessment (Arrays, Trees, Graphs, HashMaps) before you reach system design.',
      keySkills: ['Arrays, Linked Lists, Trees & Graphs', 'Time & Space Complexity (Big-O)', 'Database Indexing & SQL Queries', 'OOP Design Patterns'],
      timeEstimate: 'First 7 - 10 Days',
      targetCategory: 'Data Structures'
    },
    roadmap: [
      {
        step: 1,
        title: 'Master DSA & Core Fundamentals',
        page: '/technical-prep?category=Data%20Structures',
        description: 'Solve Arrays, Strings, Trees, and Graph problems across Beginner to Advanced.',
        isFirst: true
      },
      {
        step: 2,
        title: 'DBMS & Operating System Concepts',
        page: '/technical-prep?category=DBMS',
        description: 'Master transactions, ACID properties, indexing, caching, and concurrency.'
      },
      {
        step: 3,
        title: 'AI Technical Mock Interview',
        page: '/mock-interview?type=Technical',
        description: 'Practice explaining architectural decisions and code complexity under real pressure.'
      }
    ]
  },
  {
    id: 'fullstack',
    title: 'Full Stack Engineer',
    shortDesc: 'End-to-End Apps: Frontend + Backend + DB',
    icon: '🚀',
    tag: 'Versatile',
    prepareFirst: {
      stepNumber: 1,
      headline: 'Data Structures & Core Web Architecture',
      path: '/technical-prep?category=Web%20Development',
      buttonText: 'Start Full Stack Prep',
      badge: 'Dual Qualifier',
      whyFirst: 'Full Stack roles require demonstrating both algorithmic problem-solving and an understanding of how frontend state communicates seamlessly with backend endpoints.',
      keySkills: ['Full Stack Architecture (Client-Server-DB)', 'State Management & Async Data Fetching', 'RESTful API Design & HTTP Status Codes', 'Basic DSA & Problem Solving'],
      timeEstimate: 'First 7 Days',
      targetCategory: 'Web Development'
    },
    roadmap: [
      {
        step: 1,
        title: 'Web Dev & API Practice',
        page: '/technical-prep?category=Web%20Development',
        description: 'Test your understanding of end-to-end full stack architecture and async JS.',
        isFirst: true
      },
      {
        step: 2,
        title: 'ATS Resume Review',
        page: '/resume-analyzer',
        description: 'Check that your full stack projects have clear impact metrics and deployment URLs.'
      },
      {
        step: 3,
        title: 'Simulate Mock Interview Rounds',
        page: '/mock-interview',
        description: 'Alternate between Technical system questions and HR culture fit.'
      }
    ]
  },
  {
    id: 'campus',
    title: 'Campus Placement / Fresher',
    shortDesc: 'TCS, Infosys, Wipro, Accenture & MNCs',
    icon: '🎓',
    tag: 'Fresher Favorite',
    prepareFirst: {
      stepNumber: 1,
      headline: 'Quantitative Aptitude & Logical Reasoning',
      path: '/aptitude-prep?topic=Logical%20Reasoning',
      buttonText: 'Start Aptitude Practice Now',
      badge: 'First Round Elimination Filter',
      whyFirst: 'Campus drives use Aptitude & Logical reasoning as an automated elimination test. Up to 75% of applicants are rejected here before anyone ever reads your resume or tests your code!',
      keySkills: ['Percentages, Profit & Loss, Ratios', 'Time & Work, Speed & Distance', 'Logical Sequences & Puzzles', 'Verbal Ability & Basic Grammar'],
      timeEstimate: 'First 3 - 5 Days',
      targetCategory: 'Aptitude'
    },
    roadmap: [
      {
        step: 1,
        title: 'Clear Round 1 Aptitude Barrier',
        page: '/aptitude-prep?topic=Logical%20Reasoning',
        description: 'Score at least 80% on standard quantitative and logical question sets.',
        isFirst: true
      },
      {
        step: 2,
        title: 'Review Company-Specific Exam Patterns',
        page: '/company-prep?company=TCS',
        description: 'Study exact syllabus and recent question trends for TCS NQT, Infosys, Cognizant, etc.'
      },
      {
        step: 3,
        title: 'AI HR Mock Interview Practice',
        page: '/mock-interview?type=HR',
        description: 'Eliminate filler words and build confident speech pace for the HR interview.'
      }
    ]
  },
  {
    id: 'datascience',
    title: 'Data Scientist / AI Engineer',
    shortDesc: 'Python, Machine Learning, Stats & SQL',
    icon: '📊',
    tag: 'High Growth',
    prepareFirst: {
      stepNumber: 1,
      headline: 'Python Core & Probability / Statistics',
      path: '/technical-prep?category=Python',
      buttonText: 'Start Python & Stats Prep',
      badge: 'Analytics Qualifier',
      whyFirst: 'AI and Data Science recruiters test Python proficiency, vector operations, and fundamental probability distributions before moving to model fine-tuning.',
      keySkills: ['Python (NumPy, Pandas, Vectorization)', 'Probability Distributions & Bayes Theorem', 'SQL Joins, Aggregations & Window Functions', 'Model Evaluation Metrics (Precision/Recall/F1)'],
      timeEstimate: 'First 6 - 8 Days',
      targetCategory: 'Python'
    },
    roadmap: [
      {
        step: 1,
        title: 'Python & Statistical Foundations',
        page: '/technical-prep?category=Python',
        description: 'Sharpen Python programming constructs and algorithmic data manipulation.',
        isFirst: true
      },
      {
        step: 2,
        title: 'Aptitude: Probability & Data Interpretation',
        page: '/aptitude-prep?topic=Probability',
        description: 'Solve probability and permutation problems commonly asked in analytics screens.'
      },
      {
        step: 3,
        title: 'AI Mock Technical & Resume Check',
        page: '/resume-analyzer',
        description: 'Verify your GitHub links, Kaggle ranking, and ML project descriptions.'
      }
    ]
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Engineer',
    shortDesc: 'Docker, CI/CD, Linux, AWS & Networks',
    icon: '☁️',
    tag: 'Infrastructure',
    prepareFirst: {
      stepNumber: 1,
      headline: 'Linux Internals & Computer Networks (TCP/IP)',
      path: '/technical-prep?category=Operating%20Systems',
      buttonText: 'Start OS & Linux Practice',
      badge: 'Systems Foundation',
      whyFirst: 'Cloud automation depends fundamentally on Operating System processes, memory management, file permissions, and TCP/IP network troubleshooting.',
      keySkills: ['Linux CLI, Bash scripting & File permissions', 'Networking: TCP/IP, DNS, SSL/TLS, HTTP/2', 'Containerization concepts (Docker images vs containers)', 'CI/CD pipelines & Infrastructure as Code'],
      timeEstimate: 'First 5 - 7 Days',
      targetCategory: 'Operating Systems'
    },
    roadmap: [
      {
        step: 1,
        title: 'Operating Systems & Linux Mastery',
        page: '/technical-prep?category=Operating%20Systems',
        description: 'Revise process scheduling, thread synchronization, memory virtualization, and bash.',
        isFirst: true
      },
      {
        step: 2,
        title: 'Computer Networks Deep Dive',
        page: '/technical-prep?category=Computer%20Networks',
        description: 'Master OSI model, routing protocols, subnetting, and network troubleshooting.'
      },
      {
        step: 3,
        title: 'Technical Mock Interview Session',
        page: '/mock-interview?type=Technical',
        description: 'Explain incident management, zero-downtime deployment, and scalability.'
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    shortDesc: 'Network Security, Threat Intel & Cryptography',
    icon: '🛡️',
    tag: 'Security Focus',
    prepareFirst: {
      stepNumber: 1,
      headline: 'Computer Networks & Security Protocols',
      path: '/technical-prep?category=Computer%20Networks',
      buttonText: 'Start Network Security Prep',
      badge: 'Security Gatekeeper',
      whyFirst: 'You cannot defend what you do not understand. Cybersecurity interviews start with deep network packet inspection, firewalls, TLS handshakes, and ports.',
      keySkills: ['TCP/IP 3-Way Handshake, ARP, DNS spoofing', 'Symmetric vs Asymmetric Encryption', 'OWASP Top 10 Web Vulnerabilities', 'Penetration testing basics & Wireshark'],
      timeEstimate: 'First 6 Days',
      targetCategory: 'Computer Networks'
    },
    roadmap: [
      {
        step: 1,
        title: 'Computer Networks & Protocols',
        page: '/technical-prep?category=Computer%20Networks',
        description: 'Study protocols, vulnerabilities, and packet inspection fundamentals.',
        isFirst: true
      },
      {
        step: 2,
        title: 'Operating Systems Security',
        page: '/technical-prep?category=Operating%20Systems',
        description: 'Learn memory protection, privilege escalation, and kernel architecture.'
      },
      {
        step: 3,
        title: 'Resume & Mock Interview Drill',
        page: '/mock-interview?type=Technical',
        description: 'Simulate responding to breach scenarios and incident response playbooks.'
      }
    ]
  },
  {
    id: 'qa',
    title: 'QA / Automation Engineer (SDET)',
    shortDesc: 'Selenium, Cypress, Test Strategy & OOPs',
    icon: '🧪',
    tag: 'Quality & Test',
    prepareFirst: {
      stepNumber: 1,
      headline: 'OOP Concepts & Core Java / Python',
      path: '/technical-prep?category=OOP%20Concepts',
      buttonText: 'Start OOP & Java Practice',
      badge: 'Automation Core',
      whyFirst: 'Automation frameworks (Selenium, Playwright, JUnit) are built purely on Object-Oriented design principles (Inheritance, Polymorphism, Abstraction, Page Object Model).',
      keySkills: ['OOP Principles (Encapsulation, Polymorphism)', 'Writing Clean Unit & Integration Tests', 'API Testing (Postman, REST Assured)', 'Test Case Design: Boundary Value & Equivalence'],
      timeEstimate: 'First 5 Days',
      targetCategory: 'OOP Concepts'
    },
    roadmap: [
      {
        step: 1,
        title: 'Master OOP Concepts & Java/Python',
        page: '/technical-prep?category=OOP%20Concepts',
        description: 'Solidify your object-oriented knowledge for building maintainable test automation.',
        isFirst: true
      },
      {
        step: 2,
        title: 'Web Dev & DOM Locators',
        page: '/technical-prep?category=Web%20Development',
        description: 'Learn XPath, CSS selectors, shadow DOM, and asynchronous frontend events.'
      },
      {
        step: 3,
        title: 'Mock HR & Technical Rounds',
        page: '/mock-interview?type=HR',
        description: 'Communicate bug severity, edge cases, and cross-functional team collaboration.'
      }
    ]
  }
];

/**
 * Intelligent sniffing algorithm:
 * Given any role query (e.g. "React developer", "ML intern", "Embedded C", "Product Management"),
 * matches the best career roadmap or builds a customized high-confidence plan.
 */
export function sniffOutRoadmap(roleQuery) {
  if (!roleQuery || typeof roleQuery !== 'string') {
    return POPULAR_ROLES[0];
  }

  const query = roleQuery.trim().toLowerCase();

  // 1. Direct ID match
  const direct = POPULAR_ROLES.find(r => r.id === query || r.title.toLowerCase() === query);
  if (direct) return direct;

  // 2. Keyword rules
  if (query.includes('front') || query.includes('react') || query.includes('vue') || query.includes('angular') || query.includes('ui') || query.includes('css') || query.includes('html') || query.includes('javascript') || query.includes('typescript')) {
    return {
      ...POPULAR_ROLES.find(r => r.id === 'frontend'),
      title: roleQuery
    };
  }

  if (query.includes('back') || query.includes('java') || query.includes('spring') || query.includes('node') || query.includes('express') || query.includes('go') || query.includes('golang') || query.includes('c++') || query.includes('c#') || query.includes('.net') || query.includes('django')) {
    return {
      ...POPULAR_ROLES.find(r => r.id === 'backend'),
      title: roleQuery
    };
  }

  if (query.includes('full') || query.includes('mern') || query.includes('mean') || query.includes('web dev') || query.includes('software engineer') || query.includes('sde')) {
    return {
      ...POPULAR_ROLES.find(r => r.id === 'fullstack'),
      title: roleQuery
    };
  }

  if (query.includes('data') || query.includes('ai') || query.includes('ml') || query.includes('machine learning') || query.includes('analytics') || query.includes('deep learning') || query.includes('python')) {
    return {
      ...POPULAR_ROLES.find(r => r.id === 'datascience'),
      title: roleQuery
    };
  }

  if (query.includes('cloud') || query.includes('devops') || query.includes('aws') || query.includes('azure') || query.includes('gcp') || query.includes('docker') || query.includes('kubernetes') || query.includes('linux') || query.includes('sysadmin')) {
    return {
      ...POPULAR_ROLES.find(r => r.id === 'devops'),
      title: roleQuery
    };
  }

  if (query.includes('campus') || query.includes('fresh') || query.includes('college') || query.includes('tcs') || query.includes('infosys') || query.includes('wipro') || query.includes('cognizant') || query.includes('accenture') || query.includes('aptitude')) {
    return {
      ...POPULAR_ROLES.find(r => r.id === 'campus'),
      title: roleQuery
    };
  }

  if (query.includes('security') || query.includes('cyber') || query.includes('soc') || query.includes('penetration') || query.includes('hacker') || query.includes('network')) {
    return {
      ...POPULAR_ROLES.find(r => r.id === 'cybersecurity'),
      title: roleQuery
    };
  }

  if (query.includes('test') || query.includes('qa') || query.includes('sdet') || query.includes('quality') || query.includes('automation') || query.includes('selenium')) {
    return {
      ...POPULAR_ROLES.find(r => r.id === 'qa'),
      title: roleQuery
    };
  }

  // 3. Fallback Smart Tailored Plan for any custom role (e.g. Product Manager, Blockchain, etc.)
  return {
    id: 'custom-' + Date.now(),
    title: roleQuery.charAt(0).toUpperCase() + roleQuery.slice(1),
    shortDesc: 'Custom AI Sniffed Roadmap for ' + roleQuery,
    icon: '🎯',
    tag: 'Custom Sniffed Track',
    prepareFirst: {
      stepNumber: 1,
      headline: 'Core Domain Foundations & Problem Solving',
      path: '/technical-prep',
      buttonText: 'Start Technical Practice',
      badge: 'Priority 1 Focus',
      whyFirst: `For a ${roleQuery} career path, interviewers test your core problem-solving instincts, technical agility, and communication before advancing to specialized stages.`,
      keySkills: ['Core Problem Solving & Logic', 'Technical Architecture & Principles', 'Clear Communication & Articulation', 'Target Domain Key Concepts'],
      timeEstimate: 'First 5 - 7 Days',
      targetCategory: 'All'
    },
    roadmap: [
      {
        step: 1,
        title: 'Core Technical & Logic Foundations',
        page: '/technical-prep',
        description: 'Build confidence with foundational practice questions in your domain.',
        isFirst: true
      },
      {
        step: 2,
        title: 'Optimize Resume for ' + roleQuery,
        page: '/resume-analyzer',
        description: 'Scan your resume to ensure it includes the top ATS keywords for ' + roleQuery + '.',
        isFirst: false
      },
      {
        step: 3,
        title: 'AI Mock HR & Scenario Interview',
        page: '/mock-interview',
        description: 'Simulate behavioral and situational questions tailored for ' + roleQuery + '.',
        isFirst: false
      }
    ]
  };
}
