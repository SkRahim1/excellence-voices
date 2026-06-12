// 24 Weeks Progression Data Generator for Teachers Resource Portal
// Generates completely unique sentences for each week and subject to avoid repetitions.

const weeklyFocus = [
  { start: 1, end: 4, focus: "Basic Classroom English" },
  { start: 5, end: 8, focus: "Subject-Specific Classroom English" },
  { start: 9, end: 12, focus: "Giving Instructions and Managing Activities" },
  { start: 13, end: 16, focus: "Explaining Concepts and Examples" },
  { start: 17, end: 20, focus: "Questioning Techniques and Classroom Interaction" },
  { start: 21, end: 24, focus: "Advanced Classroom Communication, Fluency, and Confidence Building" }
];

const weeklyThemes = [
  "Greeting and Seating",
  "Classroom Attendance & Rules",
  "Everyday Commands",
  "Class Dismissal & Cleanliness",
  "Introducing Simple Subject Words",
  "Asking about Subject Topics",
  "Describing Shapes & Details",
  "Explaining Subject Equipment/Tools",
  "Setting up Group Work",
  "Directing Pair Work",
  "Whiteboard/Board Work",
  "Regulating Classroom Discipline",
  "Explaining New Definitions",
  "Giving Real-life Examples",
  "Reviewing Past Lessons",
  "Addressing Common Mistakes",
  "Simple Checks for Understanding",
  "Encouraging Students to Answer",
  "Handling Wrong Answers",
  "Guided Classroom Debates",
  "Building Public Speaking Confidence",
  "Giving Advanced Constructive Feedback",
  "Directing Student Presentations",
  "Reflection & Grand Review"
];

const subjects = [
  { id: "english", label: "English" },
  { id: "mathematics", label: "Mathematics" },
  { id: "science", label: "Science" },
  { id: "evs", label: "EVS" },
  { id: "socialStudies", label: "Social Studies" },
  { id: "computerScience", label: "Computer Science" }
];

// Template pools of 25 unique sentences each
const instructionsPool = [
  "Please sit down quietly and prepare your {subject} notes.",
  "Open your textbook to page {pageNum} immediately.",
  "Look at the whiteboard and read the daily agenda on {topic}.",
  "Write down the heading: '{topic}' in your notebooks.",
  "Take out your pencil and follow along as I read.",
  "Work quietly on the first exercise for five minutes.",
  "Turn to page {pageNumPlus5} and highlight the bold terms.",
  "Raise your hand if you need any clarification about {topic}.",
  "Put your learning materials away and wait for my signal.",
  "Ensure your workspace is clean before we start.",
  "Form groups of three and discuss {topic}.",
  "Work with your bench partner to solve this problem.",
  "Bring your notebooks to my desk for grading.",
  "Come to the whiteboard and demonstrate this example.",
  "Quiet down, please. Let's keep the noise level low.",
  "Collect the worksheets from the front desk.",
  "Keep your eyes on your own work, please.",
  "Put your pens down; your time is up.",
  "Pass your assignments to the front of the row.",
  "Observe this diagram showing {topic} carefully.",
  "Copy the summary of {topic} from the board.",
  "Listen to the explanation before you write.",
  "Compare your list of {topic} with your neighbor.",
  "Underline all the action verbs in the passage.",
  "Use a ruler to draw a neat table for {topic}."
];

const questionsPool = [
  "Who can tell me the answer to this query?",
  "Who is ready to solve this example on {topic}?",
  "Did everyone complete their {subject} homework?",
  "Do you understand the main rule of {topic}?",
  "Are there any questions about this section?",
  "May I have your full attention for a moment?",
  "Can you hear my voice clearly in the back?",
  "Where is your {subject} textbook right now?",
  "Who wants to share their thoughts first?",
  "Can everyone see the writing on the board?",
  "What is the primary definition of {topic}?",
  "Who can spell the word '{topicWord}'?",
  "How do we apply this principle in {subject}?",
  "What do you notice in this diagram of {topic}?",
  "Why is {topic} considered important in our life?",
  "Can you name three examples related to {topic}?",
  "What does this specific term mean to you?",
  "Which formula or rule do we use for this?",
  "What happens if we double the value or change this?",
  "Has everyone found a group of three?",
  "Which group is ready to present their ideas?",
  "Are you finished with the practice exercise?",
  "Why did we write this statement or formula?",
  "How can we connect {topic} to what we learned last week?",
  "Does this explanation make sense, or should I repeat it?"
];

const stockSentencesPool = [
  "Very good, that's exactly correct.",
  "Excellent work on this topic!",
  "Good try, but let's check it again.",
  "Perfect answer, well done!",
  "Superb effort, class.",
  "Keep trying; you're getting closer.",
  "You are improving day by day.",
  "Brilliant job today on {topic}.",
  "Spot on! That is the right way.",
  "Let's give them a big round of applause.",
  "Please talk quietly in your groups.",
  "Time is up! Let's stop writing.",
  "Please focus on your own worksheet.",
  "Check your partner's answer for any minor errors.",
  "You have exactly five minutes remaining.",
  "Ensure everyone in your team participates.",
  "Thank you for sharing your ideas.",
  "Let's clean the whiteboard for the next class.",
  "Fabulous teamwork shown today, children!",
  "Take a closer look at this example on {topic}.",
  "Remember: step-by-step is the key to success.",
  "This is a common error to watch out for.",
  "Let's review the main points before the quiz.",
  "I appreciate your active participation today.",
  "You spoke very clearly and confidently, well done!"
];

const explanationsPool = [
  "Today we will learn about the fundamentals of {topic}.",
  "This lesson will help you understand {topic} in daily life.",
  "Look at the example of {topic} written on the board.",
  "Let us practice pronouncing the words/formulas together.",
  "Now write down the summary in your notebook.",
  "This term represents a very important concept in {subject}.",
  "We use this rule whenever we discuss {topic}.",
  "A proper explanation of {topic} starts with this idea.",
  "This diagram illustrates the process of {topic}.",
  "We will do some interactive exercises to clarify {topic}.",
  "During this activity, we will apply the rules of {topic}.",
  "Each person must explain one point of {topic} to their group.",
  "We will use the whiteboard to note key facts about {topic}.",
  "The objective of today's lesson is to master {topic}.",
  "This exercise shows how we use {topic} in real situations.",
  "The leader will summarize the main facts about {topic}.",
  "We are practicing active discussion on {topic} today.",
  "Remember to review the previous chapter on {topic}.",
  "Here is a simple example to make {topic} clear.",
  "This idea is directly connected to what we studied previously.",
  "This chart describes the relationship between these items.",
  "We write it in this sequence to make it easy to follow.",
  "This concept helps us solve complex problems related to {topic}.",
  "Active listening is essential to understanding {topic}.",
  "Confidence is built by explaining {topic} to others."
];

// Helper to interpolate variables inside template strings
const interpolate = (template, variables) => {
  let result = template;
  Object.keys(variables).forEach(key => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), variables[key]);
  });
  return result;
};

// Content Generator
const generateData = () => {
  const data = {};

  for (let w = 1; w <= 24; w++) {
    const focusGroup = weeklyFocus.find(g => w >= g.start && w <= g.end);
    const themeName = weeklyThemes[w - 1];
    
    // Choose starting slice index for this week to prevent overlapping selections
    const startIndex = (w * 3) % 15;

    data[`week-${w}`] = {
      focus: focusGroup.focus,
      theme: themeName,
      challenge: `This Week's Challenge: Use at least 5 instructions, 3 questions, and 2 stock sentences from this list in your classroom every day.`,
    };

    subjects.forEach(subj => {
      const sId = subj.id;
      const sName = subj.label;
      const pageNum = w * 3 + 2;

      // Subject-specific vocabulary
      let topicWord = "lessons";
      let topicPhrase = themeName;

      if (sId === "english") {
        topicWord = "nouns";
        topicPhrase = `${themeName} vocabulary`;
      } else if (sId === "mathematics") {
        topicWord = "variables";
        topicPhrase = `${themeName} equations`;
      } else if (sId === "science") {
        topicWord = "molecule";
        topicPhrase = `${themeName} theory`;
      } else if (sId === "evs") {
        topicWord = "habitats";
        topicPhrase = `${themeName} ecosystems`;
      } else if (sId === "socialStudies") {
        topicWord = "maps";
        topicPhrase = `${themeName} landmarks`;
      } else if (sId === "computerScience") {
        topicWord = "keyboards";
        topicPhrase = `${themeName} settings`;
      }

      const interpolationVars = {
        subject: sName,
        topic: topicPhrase,
        pageNum: pageNum,
        pageNumPlus5: pageNum + 5,
        topicWord: topicWord
      };

      // Select 10 templates and interpolate them
      const instructions = instructionsPool
        .slice(startIndex, startIndex + 10)
        .map(t => interpolate(t, interpolationVars));

      const questions = questionsPool
        .slice(startIndex, startIndex + 10)
        .map(t => interpolate(t, interpolationVars));

      const stockSentences = stockSentencesPool
        .slice(startIndex, startIndex + 10)
        .map(t => interpolate(t, interpolationVars));

      const explanationSentences = explanationsPool
        .slice(startIndex, startIndex + 10)
        .map(t => interpolate(t, interpolationVars));

      // Dynamic custom dialogues based on subject and week
      const roleplays = [
        {
          speaker: "Teacher",
          text: `Good morning, class! Today is Week ${w} and we are exploring ${themeName}.`
        },
        {
          speaker: "Students",
          text: `Good morning, teacher! We are ready to learn.`
        },
        {
          speaker: "Teacher",
          text: `Excellent. Please turn to page ${pageNum} in your ${sName} workbook.`
        },
        {
          speaker: "Students",
          text: `Yes, teacher. We have all opened our books.`
        },
        {
          speaker: "Teacher",
          text: `Let's focus on ${topicPhrase}. Who can tell me what you know about it?`
        },
        {
          speaker: "Student A",
          text: `Teacher, I know that studying ${topicWord} helps us understand this section better.`
        },
        {
          speaker: "Teacher",
          text: "Spot on! That is exactly correct. Let's write down this key point."
        },
        {
          speaker: "Students",
          text: "We will note it down in our notebooks right away."
        }
      ];

      data[`week-${w}`][sId] = {
        title: sName,
        instructions,
        questions,
        stockSentences,
        explanationSentences,
        roleplays
      };
    });
  }

  return data;
};

const teachersData = generateData();
export default teachersData;
