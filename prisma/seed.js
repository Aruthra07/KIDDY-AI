const { PrismaClient } = require('../lib/prisma-client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing records (Optional, be careful in production)
  // await prisma.course.deleteMany();

  // 2. Seed Courses
  const roboticsCourse = await prisma.course.create({
    data: {
      title: "Robotics Rookie: Building Virtual Bots",
      description: "Learn the core mechanics of robots, sensors, and basic circuits through building interactive virtual code bots!",
      category: "Robotics",
      level: "Rookie",
      modules: {
        create: [
          {
            title: "Robot Basics",
            sortOrder: 1,
            lessons: {
              create: [
                {
                  title: "What is a Robot? Introduction to Bots",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  pdfUrl: "https://kiddyai.co/notes/intro-to-robots.pdf",
                  sortOrder: 1,
                  quizzes: {
                    create: [
                      {
                        question: "Which of these is a key component that helps a robot detect its surroundings?",
                        options: ["Wheels", "Sensors", "Paint", "Batteries"],
                        correctOption: 1
                      },
                      {
                        question: "What is considered the 'brain' of the robot?",
                        options: ["The Engine", "The Microcontroller / Processor", "The Chassis", "The LCD Screen"],
                        correctOption: 1
                      }
                    ]
                  }
                },
                {
                  title: "Sensors & Actuators: Giving Bots Senses",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  pdfUrl: "https://kiddyai.co/notes/sensors-actuators.pdf",
                  sortOrder: 2,
                  quizzes: {
                    create: [
                      {
                        question: "What kind of sensor would a robot use to avoid hitting a wall?",
                        options: ["Temperature sensor", "Ultrasonic distance sensor", "Pressure sensor", "Sound sensor"],
                        correctOption: 1
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      },
      assignments: {
        create: [
          {
            title: "Design Your Dream Robot",
            description: "Sketch or describe your own robot helper. Detail its sensors, what its mission is, and how it makes the world better.",
            dueDate: new Date("2026-07-10T23:59:59Z")
          }
        ]
      }
    }
  });

  const pythonCourse = await prisma.course.create({
    data: {
      title: "Python Explorer: Code Your First Game",
      description: "Dive into coding with Python! Learn variables, loops, and conditions while creating a text adventure game.",
      category: "Coding",
      level: "Explorer",
      modules: {
        create: [
          {
            title: "Python Syntax & Flow",
            sortOrder: 1,
            lessons: {
              create: [
                {
                  title: "Python Syntax & Variables",
                  videoUrl: "https://www.w3schools.com/html/movie.mp4",
                  sortOrder: 1,
                  quizzes: {
                    create: [
                      {
                        question: "How do you output text in Python?",
                        options: ["echo('Hello')", "print('Hello')", "console.log('Hello')", "system.out('Hello')"],
                        correctOption: 1
                      }
                    ]
                  }
                },
                {
                  title: "Conditionals & Logic: Making Choices",
                  videoUrl: "https://www.w3schools.com/html/movie.mp4",
                  sortOrder: 2,
                  quizzes: {
                    create: [
                      {
                        question: "Which keyword is used for adding a secondary condition if the first is False?",
                        options: ["else", "elif", "else if", "if2"],
                        correctOption: 1
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      },
      assignments: {
        create: [
          {
            title: "Interactive Python Storyteller",
            description: "Submit a python file (.py) containing a choice-based adventure story using if-elif-else blocks.",
            dueDate: new Date("2026-07-15T23:59:59Z")
          }
        ]
      }
    }
  });

  const aiCourse = await prisma.course.create({
    data: {
      title: "AI Magic: Prompting & Chats for Kids",
      description: "Learn how artificial intelligence works, how it learns from datasets, and how to prompt it to make stories and art safely.",
      category: "AI",
      level: "Rookie",
      modules: {
        create: [
          {
            title: "Intro to Prompting",
            sortOrder: 1,
            lessons: {
              create: [
                {
                  title: "What is AI? Machine Learning Basics",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  sortOrder: 1,
                  quizzes: {
                    create: [
                      {
                        question: "What does AI learn from to become smart?",
                        options: ["Chocolate cookies", "Datasets (data and examples)", "Superheroes", "Sleeping"],
                        correctOption: 1
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      },
      assignments: {
        create: [
          {
            title: "Prompting Craft Challenge",
            description: "Write down 3 prompts you engineered: one for generating a story, one for coding advice, and one for a beautiful image description.",
            dueDate: new Date("2026-07-20T23:59:59Z")
          }
        ]
      }
    }
  });

  // 3. Seed Live Sessions
  await prisma.liveSession.createMany({
    data: [
      {
        title: "AI Chatbots: Build Your Own Companion",
        instructorId: "Elena Vance",
        date: new Date("2026-06-25T16:00:00Z"),
        duration: 60,
        roomName: "ai-chatbots-companion",
        status: "upcoming"
      },
      {
        title: "Coding Secrets: Game Building with Scratch",
        instructorId: "Coach Dan",
        date: new Date("2026-06-23T14:00:00Z"),
        duration: 45,
        roomName: "scratch-game-secrets",
        status: "live"
      },
      {
        title: "Robots in Space: Mars Rover Mechanics",
        instructorId: "Professor Stark",
        date: new Date("2026-06-20T11:00:00Z"),
        duration: 90,
        roomName: "mars-rover-mechanics",
        status: "replay",
        replayUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
      }
    ]
  });

  // 4. Seed Bootcamps
  await prisma.bootcamp.create({
    data: {
      title: "Super-Intelligence Robotics Summer Bootcamp",
      description: "A 5-day coding & hardware simulation intensive bootcamp where students design a planetary defense bot.",
      bannerUrl: "/download.jpeg",
      schedule: [
        { day: "Day 1", topic: "Intro to Robot Architectures" },
        { day: "Day 2", topic: "Simulating Logic Circuits & Sensors" },
        { day: "Day 3", topic: "Advanced Microcontroller Coding" },
        { day: "Day 4", topic: "Machine Learning models for Pathfinding" },
        { day: "Day 5", topic: "Showcase & AI Agent presentation" }
      ],
      formLink: "https://forms.google.com/example-kiddy-bootcamp",
      resources: [
        { title: "Planetary Defense Bot Guide (PDF)", url: "https://kiddyai.co/resources/planetary-guide.pdf" },
        { title: "Bootcamp Workspace Code", url: "https://github.com/kiddyai/bootcamp-plan" }
      ]
    }
  });

  // 5. Seed Premium Modules
  await prisma.premiumModule.createMany({
    data: [
      {
        title: "AI Basics for Students",
        description: "An interactive introduction to neural networks, chatbots, and generative models built specifically for young minds.",
        thumbnail: "✨",
        category: "AI",
        difficulty: "Beginner",
        duration: "2 hours",
        teacherName: "Dr. Elena Vance",
        price: 29.99,
        enrolledCount: 420,
        certificateAvailable: true,
        outcomes: JSON.stringify([
          "Understand how machine learning works",
          "Learn to write effective prompts",
          "Identify AI systems in everyday devices"
        ]),
        previewVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
      },
      {
        title: "Introduction to Robotics",
        description: "Build logic gates, simulate microcontrollers, and program virtual robots to navigate obstacle grids.",
        thumbnail: "🤖",
        category: "Robotics",
        difficulty: "Beginner",
        duration: "3 hours",
        teacherName: "Professor Stark",
        price: 39.99,
        enrolledCount: 310,
        certificateAvailable: true,
        outcomes: JSON.stringify([
          "Understand circuits and logic flow",
          "Program simple microcontroller actions",
          "Utilize distance sensors for navigation"
        ]),
        previewVideoUrl: "https://www.w3schools.com/html/movie.mp4"
      },
      {
        title: "Mathematics Tricks: Mental Calculation Master",
        description: "Speed up arithmetic calculations using Vedic math methods and pattern recognition algorithms.",
        thumbnail: "🔢",
        category: "Mathematics",
        difficulty: "Advanced",
        duration: "1.5 hours",
        teacherName: "Coach Dan",
        price: 19.99,
        enrolledCount: 150,
        certificateAvailable: false,
        outcomes: JSON.stringify([
          "Multiply 3-digit numbers mentally",
          "Estimate square roots quickly",
          "Solve speed coordinates calculations"
        ]),
        previewVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
      }
    ]
  });

  // 6. Seed Student Clubs
  await prisma.studentClub.createMany({
    data: [
      {
        name: "Space Explorers",
        description: "For kids interested in orbital physics, rocket paths, and planetary navigation.",
        category: "space",
        membersCount: 88,
        bannerUrl: "🌌"
      },
      {
        name: "Game Builders Club",
        description: "Design logic grids, build custom pixel maps, and script game mechanics.",
        category: "coding",
        membersCount: 120,
        bannerUrl: "🎮"
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
