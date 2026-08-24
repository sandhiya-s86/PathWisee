/**
 * Seed the MySQL database with careers, questions, and learning paths.
 * Run: node seed.js
 *
 * Prerequisites: MySQL running, schema.sql already applied.
 */
require('dotenv').config();
const pool = require('./config/db');

async function clearSeedData(conn) {
  console.log('Clearing existing seed data...');
  const tables = [
    'question_option_career_weights', 'question_options', 'questions',
    'user_progress_milestones', 'milestones', 'learning_paths', 'roadmaps',
    'exam_career_relations', 'entrance_exams',
    'college_exam_relations', 'college_career_relations', 'colleges',
    'career_skills_required', 'career_academic_stages', 'career_streams', 'careers',
  ];
  for (const table of tables) {
    await conn.execute(`DELETE FROM \`${table}\``);
  }
}

async function seedCareers(conn) {
  const careers = [
    {
      id: 'software_engineer', name: 'Software Engineer',
      description: 'Design, develop, and maintain software applications and systems',
      icon: 'Code', salary_range: '$80k - $180k',
      education_required: "Bachelor's in Computer Science or related field",
      skills_required: ['Programming', 'Problem Solving', 'Algorithms', 'Data Structures'],
      academic_stages: ['undergraduate', 'graduate', 'postgraduate'],
      streams: ['science', 'engineering', 'technology'],
    },
    {
      id: 'data_scientist', name: 'Data Scientist',
      description: 'Analyze complex data to help organizations make better decisions',
      icon: 'BarChart3', salary_range: '$90k - $170k',
      education_required: "Bachelor's/Master's in Data Science, Statistics, or related field",
      skills_required: ['Statistics', 'Machine Learning', 'Python/R', 'Data Visualization'],
      academic_stages: ['undergraduate', 'graduate', 'postgraduate'],
      streams: ['science', 'mathematics', 'technology'],
    },
    {
      id: 'product_manager', name: 'Product Manager',
      description: 'Lead product strategy and drive development from concept to launch',
      icon: 'Layers', salary_range: '$100k - $200k',
      education_required: "Bachelor's in Business, CS, or related field; MBA helpful",
      skills_required: ['Strategy', 'Communication', 'User Research', 'Project Management'],
      academic_stages: ['undergraduate', 'graduate', 'postgraduate'],
      streams: ['business', 'engineering', 'arts'],
    },
    {
      id: 'ux_designer', name: 'UX/UI Designer',
      description: 'Create intuitive and engaging user experiences for digital products',
      icon: 'Palette', salary_range: '$70k - $140k',
      education_required: "Bachelor's in Design, HCI, or related field",
      skills_required: ['Design Tools', 'User Research', 'Prototyping', 'Visual Design'],
      academic_stages: ['undergraduate', 'graduate'],
      streams: ['arts', 'design', 'technology'],
    },
    {
      id: 'digital_marketer', name: 'Digital Marketer',
      description: 'Develop and execute marketing strategies across digital channels',
      icon: 'TrendingUp', salary_range: '$60k - $130k',
      education_required: "Bachelor's in Marketing, Communications, or related field",
      skills_required: ['SEO/SEM', 'Content Strategy', 'Analytics', 'Social Media'],
      academic_stages: ['undergraduate', 'graduate'],
      streams: ['business', 'arts', 'commerce'],
    },
    {
      id: 'business_analyst', name: 'Business Analyst',
      description: 'Bridge the gap between IT and business using data analytics',
      icon: 'Briefcase', salary_range: '$65k - $120k',
      education_required: "Bachelor's in Business, IT, or related field",
      skills_required: ['Data Analysis', 'Requirements Gathering', 'SQL', 'Business Strategy'],
      academic_stages: ['undergraduate', 'graduate'],
      streams: ['business', 'commerce', 'technology'],
    },
    {
      id: 'cybersecurity', name: 'Cybersecurity Specialist',
      description: 'Protect systems and networks from digital attacks and threats',
      icon: 'Shield', salary_range: '$85k - $160k',
      education_required: "Bachelor's in Cybersecurity, IT, or related field",
      skills_required: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Compliance'],
      academic_stages: ['undergraduate', 'graduate', 'postgraduate'],
      streams: ['science', 'engineering', 'technology'],
    },
  ];

  const now = new Date();
  for (const c of careers) {
    await conn.execute(
      'INSERT INTO careers (id, name, description, icon, salary_range, education_required, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [c.id, c.name, c.description, c.icon, c.salary_range, c.education_required, now],
    );
    for (const skill of c.skills_required) {
      await conn.execute('INSERT IGNORE INTO career_skills_required (career_id, skill) VALUES (?, ?)', [c.id, skill]);
    }
    for (const stage of c.academic_stages) {
      await conn.execute('INSERT IGNORE INTO career_academic_stages (career_id, stage) VALUES (?, ?)', [c.id, stage]);
    }
    for (const stream of c.streams) {
      await conn.execute('INSERT IGNORE INTO career_streams (career_id, stream) VALUES (?, ?)', [c.id, stream]);
    }
  }
  console.log(`✓ Inserted ${careers.length} careers`);
}

async function seedQuestions(conn) {
  const questions = [
    { id: 'q1', text: 'What type of activities do you enjoy most?', order: 1, options: [
      { id: 'q1_a', text: 'Building and creating things from scratch', order: 1, weights: { software_engineer: 3, ux_designer: 2 } },
      { id: 'q1_b', text: 'Analyzing patterns and solving puzzles',   order: 2, weights: { data_scientist: 3, business_analyst: 2 } },
      { id: 'q1_c', text: 'Communicating ideas and influencing others', order: 3, weights: { product_manager: 3, digital_marketer: 2 } },
      { id: 'q1_d', text: 'Protecting and securing valuable assets',  order: 4, weights: { cybersecurity: 3, business_analyst: 1 } },
    ]},
    { id: 'q2', text: 'Which skill would you like to develop further?', order: 2, options: [
      { id: 'q2_a', text: 'Programming and coding',           order: 1, weights: { software_engineer: 4, data_scientist: 2 } },
      { id: 'q2_b', text: 'Visual design and aesthetics',     order: 2, weights: { ux_designer: 4, digital_marketer: 1 } },
      { id: 'q2_c', text: 'Strategic thinking and planning',  order: 3, weights: { product_manager: 4, business_analyst: 2 } },
      { id: 'q2_d', text: 'Risk analysis and prevention',     order: 4, weights: { cybersecurity: 4 } },
    ]},
    { id: 'q3', text: 'How do you prefer to work?', order: 3, options: [
      { id: 'q3_a', text: 'Deep focus on technical challenges', order: 1, weights: { software_engineer: 3, data_scientist: 3, cybersecurity: 2 } },
      { id: 'q3_b', text: 'Collaborating with diverse teams',   order: 2, weights: { product_manager: 3, ux_designer: 2 } },
      { id: 'q3_c', text: 'Researching and presenting insights', order: 3, weights: { business_analyst: 3, data_scientist: 2 } },
      { id: 'q3_d', text: 'Creating content and campaigns',     order: 4, weights: { digital_marketer: 4, ux_designer: 1 } },
    ]},
    { id: 'q4', text: 'What motivates you the most?', order: 4, options: [
      { id: 'q4_a', text: 'Solving complex problems',      order: 1, weights: { software_engineer: 3, data_scientist: 3 } },
      { id: 'q4_b', text: 'Creating beautiful experiences', order: 2, weights: { ux_designer: 4 } },
      { id: 'q4_c', text: 'Driving business growth',       order: 3, weights: { digital_marketer: 3, product_manager: 3 } },
      { id: 'q4_d', text: 'Ensuring safety and security',  order: 4, weights: { cybersecurity: 4 } },
    ]},
    { id: 'q5', text: 'Which subject interests you most?', order: 5, options: [
      { id: 'q5_a', text: 'Mathematics and Logic',       order: 1, weights: { software_engineer: 3, data_scientist: 4 } },
      { id: 'q5_b', text: 'Psychology and Human Behavior', order: 2, weights: { ux_designer: 4, product_manager: 2 } },
      { id: 'q5_c', text: 'Business and Economics',      order: 3, weights: { business_analyst: 4, product_manager: 2 } },
      { id: 'q5_d', text: 'Communication and Media',     order: 4, weights: { digital_marketer: 4 } },
    ]},
    { id: 'q6', text: "What's your ideal work environment?", order: 6, options: [
      { id: 'q6_a', text: 'Fast-paced tech startup',           order: 1, weights: { software_engineer: 2, product_manager: 3 } },
      { id: 'q6_b', text: 'Creative agency or design studio',  order: 2, weights: { ux_designer: 4, digital_marketer: 2 } },
      { id: 'q6_c', text: 'Corporate or consulting firm',      order: 3, weights: { business_analyst: 3, cybersecurity: 2 } },
      { id: 'q6_d', text: 'Research or analytics lab',         order: 4, weights: { data_scientist: 4 } },
    ]},
    { id: 'q7', text: 'How do you handle challenges?', order: 7, options: [
      { id: 'q7_a', text: 'Break them down logically',          order: 1, weights: { software_engineer: 3, business_analyst: 2 } },
      { id: 'q7_b', text: 'Research and analyze data',          order: 2, weights: { data_scientist: 4, business_analyst: 2 } },
      { id: 'q7_c', text: 'Collaborate and brainstorm',         order: 3, weights: { product_manager: 3, ux_designer: 2 } },
      { id: 'q7_d', text: 'Test different creative approaches',  order: 4, weights: { digital_marketer: 3, ux_designer: 2 } },
    ]},
    { id: 'q8', text: 'What tools would you enjoy learning?', order: 8, options: [
      { id: 'q8_a', text: 'Programming languages (Python, JavaScript)', order: 1, weights: { software_engineer: 4, data_scientist: 2 } },
      { id: 'q8_b', text: 'Design software (Figma, Adobe XD)',          order: 2, weights: { ux_designer: 4 } },
      { id: 'q8_c', text: 'Analytics platforms (Google Analytics, Tableau)', order: 3, weights: { digital_marketer: 3, data_scientist: 2 } },
      { id: 'q8_d', text: 'Security tools (Wireshark, Metasploit)',     order: 4, weights: { cybersecurity: 4 } },
    ]},
    { id: 'q9', text: 'What type of projects excite you?', order: 9, options: [
      { id: 'q9_a', text: 'Building apps or websites',    order: 1, weights: { software_engineer: 4, ux_designer: 1 } },
      { id: 'q9_b', text: 'Predicting trends from data',  order: 2, weights: { data_scientist: 4, business_analyst: 2 } },
      { id: 'q9_c', text: 'Launching new products',       order: 3, weights: { product_manager: 4, digital_marketer: 2 } },
      { id: 'q9_d', text: 'Creating viral campaigns',     order: 4, weights: { digital_marketer: 4 } },
    ]},
    { id: 'q10', text: "What's most important to you in a career?", order: 10, options: [
      { id: 'q10_a', text: 'Innovation and cutting-edge tech', order: 1, weights: { software_engineer: 3, data_scientist: 2 } },
      { id: 'q10_b', text: 'Creativity and self-expression',   order: 2, weights: { ux_designer: 4, digital_marketer: 2 } },
      { id: 'q10_c', text: 'Leadership and impact',            order: 3, weights: { product_manager: 4 } },
      { id: 'q10_d', text: 'Stability and security',           order: 4, weights: { cybersecurity: 3, business_analyst: 2 } },
    ]},
  ];

  for (const q of questions) {
    await conn.execute('INSERT INTO questions (id, text, display_order) VALUES (?, ?, ?)', [q.id, q.text, q.order]);
    for (const opt of q.options) {
      await conn.execute(
        'INSERT INTO question_options (id, question_id, text, display_order) VALUES (?, ?, ?, ?)',
        [opt.id, q.id, opt.text, opt.order],
      );
      for (const [careerId, weight] of Object.entries(opt.weights)) {
        await conn.execute(
          'INSERT INTO question_option_career_weights (option_id, career_id, weight) VALUES (?, ?, ?)',
          [opt.id, careerId, weight],
        );
      }
    }
  }
  console.log(`✓ Inserted ${questions.length} questions`);
}

async function seedLearningPaths(conn) {
  const paths = [
    { id: 'path_software_engineer', career_id: 'software_engineer', milestones: [
      { id: 'path_software_engineer_m1', title: 'Learn Programming Basics', description: 'Master Python or JavaScript fundamentals', duration: '2-3 months', order: 1 },
      { id: 'path_software_engineer_m2', title: 'Data Structures & Algorithms', description: 'Study core CS concepts and problem-solving', duration: '3-4 months', order: 2 },
      { id: 'path_software_engineer_m3', title: 'Build Projects', description: 'Create 3-5 portfolio projects', duration: '2-3 months', order: 3 },
      { id: 'path_software_engineer_m4', title: 'Learn Web Development', description: 'Frontend (React) and Backend (Node/Python)', duration: '4-5 months', order: 4 },
      { id: 'path_software_engineer_m5', title: 'Practice Interviews', description: 'LeetCode, system design, behavioral prep', duration: '2-3 months', order: 5 },
    ]},
    { id: 'path_data_scientist', career_id: 'data_scientist', milestones: [
      { id: 'path_data_scientist_m1', title: 'Statistics & Mathematics', description: 'Learn probability, statistics, and linear algebra', duration: '3-4 months', order: 1 },
      { id: 'path_data_scientist_m2', title: 'Python for Data Science', description: 'Master pandas, numpy, matplotlib', duration: '2-3 months', order: 2 },
      { id: 'path_data_scientist_m3', title: 'Machine Learning', description: 'Study algorithms and build ML models', duration: '4-5 months', order: 3 },
      { id: 'path_data_scientist_m4', title: 'Data Projects', description: 'Complete Kaggle competitions and projects', duration: '3-4 months', order: 4 },
      { id: 'path_data_scientist_m5', title: 'Advanced Topics', description: 'Deep learning, NLP, or computer vision', duration: '4-6 months', order: 5 },
    ]},
    { id: 'path_product_manager', career_id: 'product_manager', milestones: [
      { id: 'path_product_manager_m1', title: 'Product Fundamentals', description: 'Learn product lifecycle and frameworks', duration: '2-3 months', order: 1 },
      { id: 'path_product_manager_m2', title: 'User Research', description: 'Master interview techniques and data analysis', duration: '2-3 months', order: 2 },
      { id: 'path_product_manager_m3', title: 'Technical Skills', description: 'Basic SQL, APIs, and tech concepts', duration: '2-3 months', order: 3 },
      { id: 'path_product_manager_m4', title: 'Launch a Product', description: 'Side project or internship experience', duration: '3-6 months', order: 4 },
      { id: 'path_product_manager_m5', title: 'Business Strategy', description: 'Study market analysis and business models', duration: '3-4 months', order: 5 },
    ]},
    { id: 'path_ux_designer', career_id: 'ux_designer', milestones: [
      { id: 'path_ux_designer_m1', title: 'Design Fundamentals', description: 'Learn color theory, typography, layout', duration: '2-3 months', order: 1 },
      { id: 'path_ux_designer_m2', title: 'Design Tools', description: 'Master Figma, Adobe XD, or Sketch', duration: '2-3 months', order: 2 },
      { id: 'path_ux_designer_m3', title: 'UX Research', description: 'User interviews, personas, journey mapping', duration: '2-3 months', order: 3 },
      { id: 'path_ux_designer_m4', title: 'Build Portfolio', description: 'Complete 3-4 case studies', duration: '3-4 months', order: 4 },
      { id: 'path_ux_designer_m5', title: 'Interaction Design', description: 'Prototyping and usability testing', duration: '2-3 months', order: 5 },
    ]},
    { id: 'path_digital_marketer', career_id: 'digital_marketer', milestones: [
      { id: 'path_digital_marketer_m1', title: 'Marketing Fundamentals', description: 'Learn marketing principles and strategy', duration: '2-3 months', order: 1 },
      { id: 'path_digital_marketer_m2', title: 'Content Marketing', description: 'Master SEO, blogging, and copywriting', duration: '2-3 months', order: 2 },
      { id: 'path_digital_marketer_m3', title: 'Social Media Marketing', description: 'Platform strategies and community building', duration: '2-3 months', order: 3 },
      { id: 'path_digital_marketer_m4', title: 'Analytics & Tools', description: 'Google Analytics, Meta Ads, email marketing', duration: '2-3 months', order: 4 },
      { id: 'path_digital_marketer_m5', title: 'Launch Campaigns', description: 'Execute real marketing projects', duration: '3-4 months', order: 5 },
    ]},
    { id: 'path_business_analyst', career_id: 'business_analyst', milestones: [
      { id: 'path_business_analyst_m1', title: 'Business Fundamentals', description: 'Learn business processes and analysis', duration: '2-3 months', order: 1 },
      { id: 'path_business_analyst_m2', title: 'SQL & Data Analysis', description: 'Master SQL and Excel for data work', duration: '2-3 months', order: 2 },
      { id: 'path_business_analyst_m3', title: 'Requirements Gathering', description: 'Documentation and stakeholder management', duration: '2-3 months', order: 3 },
      { id: 'path_business_analyst_m4', title: 'Visualization Tools', description: 'Tableau, Power BI, or similar', duration: '2-3 months', order: 4 },
      { id: 'path_business_analyst_m5', title: 'Real Projects', description: 'Internship or case study work', duration: '3-6 months', order: 5 },
    ]},
    { id: 'path_cybersecurity', career_id: 'cybersecurity', milestones: [
      { id: 'path_cybersecurity_m1', title: 'Networking Basics', description: 'Learn TCP/IP, protocols, and network security', duration: '3-4 months', order: 1 },
      { id: 'path_cybersecurity_m2', title: 'Operating Systems', description: 'Linux administration and Windows security', duration: '2-3 months', order: 2 },
      { id: 'path_cybersecurity_m3', title: 'Security Fundamentals', description: 'Cryptography, threats, and vulnerabilities', duration: '3-4 months', order: 3 },
      { id: 'path_cybersecurity_m4', title: 'Ethical Hacking', description: 'Penetration testing and tools', duration: '3-4 months', order: 4 },
      { id: 'path_cybersecurity_m5', title: 'Certifications', description: 'CompTIA Security+, CEH, or CISSP prep', duration: '4-6 months', order: 5 },
    ]},
  ];

  for (const lp of paths) {
    await conn.execute('INSERT INTO learning_paths (id, career_id) VALUES (?, ?)', [lp.id, lp.career_id]);
    for (const m of lp.milestones) {
      await conn.execute(
        'INSERT INTO milestones (id, learning_path_id, title, description, duration, display_order) VALUES (?, ?, ?, ?, ?, ?)',
        [m.id, lp.id, m.title, m.description, m.duration, m.order],
      );
    }
  }
  console.log(`✓ Inserted ${paths.length} learning paths`);
  return paths;
}

// Roadmaps power the Learning Path page (GET /api/careers/:id/roadmap).
// Derived from the same milestone data as learning paths.
async function seedRoadmaps(conn, paths) {
  for (const lp of paths) {
    const content = {
      steps: lp.milestones.map(m => ({
        id: m.id, title: m.title, description: m.description, duration: m.duration,
      })),
    };
    await conn.execute(
      'INSERT INTO roadmaps (id, career_id, content) VALUES (?, ?, ?)',
      [`roadmap_${lp.career_id}`, lp.career_id, JSON.stringify(content)],
    );
  }
  console.log(`✓ Inserted ${paths.length} roadmaps`);
}

async function seedExams(conn) {
  const exams = [
    {
      id: 'jee_main', name: 'JEE Main', category: 'Engineering',
      careers: ['software_engineer', 'data_scientist', 'cybersecurity'],
      data: {
        full_name: 'Joint Entrance Examination – Main',
        conducting_body: 'National Testing Agency (NTA)',
        eligibility: 'Class 12 with Physics, Chemistry & Mathematics',
        difficulty: 'Hard',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        top_colleges: ['NIT Trichy', 'IIIT Hyderabad', 'DTU Delhi'],
      },
    },
    {
      id: 'jee_advanced', name: 'JEE Advanced', category: 'Engineering',
      careers: ['software_engineer', 'data_scientist', 'cybersecurity'],
      data: {
        full_name: 'Joint Entrance Examination – Advanced',
        conducting_body: 'IITs (rotating)',
        eligibility: 'Top 2.5 lakh rankers of JEE Main',
        difficulty: 'Very Hard',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        top_colleges: ['IIT Bombay', 'IIT Delhi', 'IIT Madras'],
      },
    },
    {
      id: 'bitsat', name: 'BITSAT', category: 'Engineering',
      careers: ['software_engineer', 'data_scientist', 'cybersecurity'],
      data: {
        full_name: 'BITS Admission Test',
        conducting_body: 'BITS Pilani',
        eligibility: 'Class 12 with PCM, 75% aggregate',
        difficulty: 'Hard',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Logical Reasoning'],
        top_colleges: ['BITS Pilani', 'BITS Goa', 'BITS Hyderabad'],
      },
    },
    {
      id: 'gate', name: 'GATE', category: 'Engineering',
      careers: ['software_engineer', 'data_scientist', 'cybersecurity'],
      data: {
        full_name: 'Graduate Aptitude Test in Engineering',
        conducting_body: 'IISc / IITs (rotating)',
        eligibility: "Bachelor's degree in Engineering / Science",
        difficulty: 'Hard',
        subjects: ['Engineering Mathematics', 'General Aptitude', 'Subject Paper'],
        top_colleges: ['IISc Bangalore', 'IIT Bombay', 'IIT Delhi'],
      },
    },
    {
      id: 'neet_ug', name: 'NEET UG', category: 'Medical',
      careers: [],
      data: {
        full_name: 'National Eligibility cum Entrance Test (UG)',
        conducting_body: 'National Testing Agency (NTA)',
        eligibility: 'Class 12 with Physics, Chemistry & Biology',
        difficulty: 'Very Hard',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        top_colleges: ['AIIMS Delhi', 'CMC Vellore', 'JIPMER Puducherry'],
      },
    },
    {
      id: 'cat', name: 'CAT', category: 'Management',
      careers: ['product_manager', 'business_analyst', 'digital_marketer'],
      data: {
        full_name: 'Common Admission Test',
        conducting_body: 'IIMs (rotating)',
        eligibility: "Bachelor's degree with 50% marks",
        difficulty: 'Hard',
        subjects: ['Quantitative Ability', 'Verbal Ability', 'Data Interpretation & Logical Reasoning'],
        top_colleges: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta'],
      },
    },
    {
      id: 'xat', name: 'XAT', category: 'Management',
      careers: ['product_manager', 'business_analyst', 'digital_marketer'],
      data: {
        full_name: 'Xavier Aptitude Test',
        conducting_body: 'XLRI Jamshedpur',
        eligibility: "Bachelor's degree in any discipline",
        difficulty: 'Hard',
        subjects: ['Decision Making', 'Verbal Ability', 'Quantitative Ability', 'General Knowledge'],
        top_colleges: ['XLRI Jamshedpur', 'XIM Bhubaneswar', 'IMT Ghaziabad'],
      },
    },
    {
      id: 'clat', name: 'CLAT', category: 'Law',
      careers: [],
      data: {
        full_name: 'Common Law Admission Test',
        conducting_body: 'Consortium of NLUs',
        eligibility: 'Class 12 with 45% marks',
        difficulty: 'Moderate',
        subjects: ['English', 'Legal Reasoning', 'Logical Reasoning', 'Current Affairs', 'Quantitative Techniques'],
        top_colleges: ['NLSIU Bangalore', 'NALSAR Hyderabad', 'NLU Delhi'],
      },
    },
    {
      id: 'upsc_cse', name: 'UPSC CSE', category: 'Government',
      careers: [],
      data: {
        full_name: 'Union Public Service Commission – Civil Services Examination',
        conducting_body: 'UPSC',
        eligibility: "Bachelor's degree, age 21-32",
        difficulty: 'Very Hard',
        subjects: ['General Studies', 'CSAT', 'Optional Subject', 'Essay'],
        top_colleges: ['LBSNAA Mussoorie (training)'],
      },
    },
    {
      id: 'ssc_cgl', name: 'SSC CGL', category: 'Government',
      careers: [],
      data: {
        full_name: 'Staff Selection Commission – Combined Graduate Level',
        conducting_body: 'Staff Selection Commission',
        eligibility: "Bachelor's degree in any discipline",
        difficulty: 'Moderate',
        subjects: ['General Intelligence', 'General Awareness', 'Quantitative Aptitude', 'English'],
        top_colleges: [],
      },
    },
  ];

  for (const e of exams) {
    await conn.execute(
      'INSERT INTO entrance_exams (id, name, category, data) VALUES (?, ?, ?, ?)',
      [e.id, e.name, e.category, JSON.stringify(e.data)],
    );
    for (const careerId of e.careers) {
      await conn.execute(
        'INSERT IGNORE INTO exam_career_relations (exam_id, career_id) VALUES (?, ?)',
        [e.id, careerId],
      );
    }
  }
  console.log(`✓ Inserted ${exams.length} entrance exams`);
}

async function seedColleges(conn) {
  const TECH = ['software_engineer', 'data_scientist', 'cybersecurity'];
  const MGMT = ['product_manager', 'business_analyst', 'digital_marketer'];

  const colleges = [
    {
      id: 'iit_bombay', name: 'IIT Bombay', state: 'Maharashtra',
      exams: ['jee_advanced', 'gate'], careers: TECH,
      data: {
        location: { city: 'Mumbai', state: 'Maharashtra' },
        type: 'Government', rating: 4.9, fees_range: '₹2-2.5 Lakh/year',
        courses: ['B.Tech', 'M.Tech', 'Dual Degree', 'PhD'],
        entrance_exams: ['JEE Advanced', 'GATE'],
      },
    },
    {
      id: 'iit_delhi', name: 'IIT Delhi', state: 'Delhi',
      exams: ['jee_advanced', 'gate'], careers: TECH,
      data: {
        location: { city: 'New Delhi', state: 'Delhi' },
        type: 'Government', rating: 4.8, fees_range: '₹2-2.5 Lakh/year',
        courses: ['B.Tech', 'M.Tech', 'MS(R)', 'PhD'],
        entrance_exams: ['JEE Advanced', 'GATE'],
      },
    },
    {
      id: 'iit_madras', name: 'IIT Madras', state: 'Tamil Nadu',
      exams: ['jee_advanced', 'gate'], careers: TECH,
      data: {
        location: { city: 'Chennai', state: 'Tamil Nadu' },
        type: 'Government', rating: 4.9, fees_range: '₹2-2.5 Lakh/year',
        courses: ['B.Tech', 'M.Tech', 'BS Data Science (online)', 'PhD'],
        entrance_exams: ['JEE Advanced', 'GATE'],
      },
    },
    {
      id: 'nit_trichy', name: 'NIT Tiruchirappalli', state: 'Tamil Nadu',
      exams: ['jee_main', 'gate'], careers: TECH,
      data: {
        location: { city: 'Tiruchirappalli', state: 'Tamil Nadu' },
        type: 'Government', rating: 4.6, fees_range: '₹1.5-2 Lakh/year',
        courses: ['B.Tech', 'M.Tech', 'MCA', 'MBA'],
        entrance_exams: ['JEE Main', 'GATE'],
      },
    },
    {
      id: 'bits_pilani', name: 'BITS Pilani', state: 'Rajasthan',
      exams: ['bitsat'], careers: TECH,
      data: {
        location: { city: 'Pilani', state: 'Rajasthan' },
        type: 'Private', rating: 4.6, fees_range: '₹5-6 Lakh/year',
        courses: ['B.E.', 'M.Sc.', 'M.E.', 'PhD'],
        entrance_exams: ['BITSAT'],
      },
    },
    {
      id: 'iiit_hyderabad', name: 'IIIT Hyderabad', state: 'Telangana',
      exams: ['jee_main'], careers: TECH,
      data: {
        location: { city: 'Hyderabad', state: 'Telangana' },
        type: 'Private (Deemed)', rating: 4.7, fees_range: '₹4-4.5 Lakh/year',
        courses: ['B.Tech CSE', 'B.Tech ECE', 'MS by Research', 'PhD'],
        entrance_exams: ['JEE Main', 'UGEE'],
      },
    },
    {
      id: 'aiims_delhi', name: 'AIIMS Delhi', state: 'Delhi',
      exams: ['neet_ug'], careers: [],
      data: {
        location: { city: 'New Delhi', state: 'Delhi' },
        type: 'Government', rating: 4.9, fees_range: '₹1,600/year (MBBS)',
        courses: ['MBBS', 'MD', 'MS', 'B.Sc Nursing'],
        entrance_exams: ['NEET UG', 'INI-CET'],
      },
    },
    {
      id: 'cmc_vellore', name: 'CMC Vellore', state: 'Tamil Nadu',
      exams: ['neet_ug'], careers: [],
      data: {
        location: { city: 'Vellore', state: 'Tamil Nadu' },
        type: 'Private', rating: 4.7, fees_range: '₹50k-1 Lakh/year',
        courses: ['MBBS', 'MD', 'B.Sc Nursing', 'Allied Health'],
        entrance_exams: ['NEET UG'],
      },
    },
    {
      id: 'iim_ahmedabad', name: 'IIM Ahmedabad', state: 'Gujarat',
      exams: ['cat'], careers: MGMT,
      data: {
        location: { city: 'Ahmedabad', state: 'Gujarat' },
        type: 'Government', rating: 4.9, fees_range: '₹12-13 Lakh/year',
        courses: ['MBA (PGP)', 'PGPX', 'PhD'],
        entrance_exams: ['CAT'],
      },
    },
    {
      id: 'iim_bangalore', name: 'IIM Bangalore', state: 'Karnataka',
      exams: ['cat'], careers: MGMT,
      data: {
        location: { city: 'Bengaluru', state: 'Karnataka' },
        type: 'Government', rating: 4.8, fees_range: '₹12-13 Lakh/year',
        courses: ['MBA (PGP)', 'EPGP', 'PhD'],
        entrance_exams: ['CAT'],
      },
    },
    {
      id: 'xlri_jamshedpur', name: 'XLRI Jamshedpur', state: 'Jharkhand',
      exams: ['xat'], careers: MGMT,
      data: {
        location: { city: 'Jamshedpur', state: 'Jharkhand' },
        type: 'Private', rating: 4.6, fees_range: '₹14-15 Lakh (total)',
        courses: ['PGDM (BM)', 'PGDM (HRM)', 'FPM'],
        entrance_exams: ['XAT'],
      },
    },
    {
      id: 'nlsiu_bangalore', name: 'NLSIU Bangalore', state: 'Karnataka',
      exams: ['clat'], careers: [],
      data: {
        location: { city: 'Bengaluru', state: 'Karnataka' },
        type: 'Government', rating: 4.7, fees_range: '₹3-4 Lakh/year',
        courses: ['BA LLB (Hons)', 'LLM', 'MPP'],
        entrance_exams: ['CLAT'],
      },
    },
  ];

  for (const c of colleges) {
    await conn.execute(
      'INSERT INTO colleges (id, name, state, data) VALUES (?, ?, ?, ?)',
      [c.id, c.name, c.state, JSON.stringify(c.data)],
    );
    for (const examId of c.exams) {
      await conn.execute(
        'INSERT IGNORE INTO college_exam_relations (college_id, exam_id) VALUES (?, ?)',
        [c.id, examId],
      );
    }
    for (const careerId of c.careers) {
      await conn.execute(
        'INSERT IGNORE INTO college_career_relations (college_id, career_id) VALUES (?, ?)',
        [c.id, careerId],
      );
    }
  }
  console.log(`✓ Inserted ${colleges.length} colleges`);
}

async function main() {
  const conn = await pool.getConnection();
  try {
    console.log('Starting database seed...');
    await clearSeedData(conn);
    await seedCareers(conn);
    await seedQuestions(conn);
    const paths = await seedLearningPaths(conn);
    await seedRoadmaps(conn, paths);
    await seedExams(conn);
    await seedColleges(conn);
    console.log('\nDatabase seeding completed successfully!');
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
