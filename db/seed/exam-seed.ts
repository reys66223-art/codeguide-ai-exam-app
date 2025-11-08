import { db } from "../index";
import { students, teachers, exams, questions } from "../schema/exam";
import { user } from "../schema/auth";
import { eq } from "drizzle-orm";

async function seedExamData() {
  try {
    console.log("🌱 Seeding exam data...");

    // Create sample teacher user
    const [teacherUser] = await db.insert(user).values({
      id: "teacher-001",
      name: "John Doe",
      email: "john.doe@school.edu",
      emailVerified: true,
    }).onConflictDoNothing().returning();

    // Create teacher record
    if (teacherUser) {
      await db.insert(teachers).values({
        userId: teacherUser.id,
        schoolName: "Sample High School",
        teacherId: "TCH001",
      }).onConflictDoNothing();
    }

    // Create sample students
    const sampleStudents = [
      {
        name: "Alice Johnson",
        nisn: "20230001",
        dateOfBirth: new Date("2005-03-15"),
        password: "password123", // In production, this should be hashed
      },
      {
        name: "Bob Smith",
        nisn: "20230002",
        dateOfBirth: new Date("2005-07-22"),
        password: "password123",
      },
      {
        name: "Carol Williams",
        nisn: "20230003",
        dateOfBirth: new Date("2005-11-08"),
        password: "password123",
      },
      {
        name: "David Brown",
        nisn: "20230004",
        dateOfBirth: new Date("2005-01-30"),
        password: "password123",
      },
      {
        name: "Emma Davis",
        nisn: "20230005",
        dateOfBirth: new Date("2005-09-12"),
        password: "password123",
      },
    ];

    await db.insert(students).values(sampleStudents).onConflictDoNothing();

    // Create sample exam
    const [teacher] = await db.select().from(teachers).limit(1);

    if (teacher) {
      const [newExam] = await db.insert(exams).values({
        teacherId: teacher.id,
        title: "Mathematics Final Exam",
        description: "Comprehensive math exam covering algebra, geometry, and statistics",
        duration: 90, // 90 minutes
        displayMode: "one_by_one",
        examCode: "MATH2024",
        status: "active",
        isActive: true,
        startTime: new Date(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }).returning();

      // Create sample questions
      if (newExam) {
        const sampleQuestions = [
          // Multiple choice questions
          {
            examId: newExam.id,
            type: "multiple_choice" as const,
            content: "What is the value of x in the equation 2x + 5 = 13?",
            options: ["x = 3", "x = 4", "x = 5", "x = 6"],
            correctAnswer: "x = 4",
            points: 5,
            order: 1,
          },
          {
            examId: newExam.id,
            type: "multiple_choice" as const,
            content: "What is the area of a circle with radius 5 cm?",
            options: ["25π cm²", "10π cm²", "5π cm²", "50π cm²"],
            correctAnswer: "25π cm²",
            points: 5,
            order: 2,
          },
          {
            examId: newExam.id,
            type: "multiple_choice" as const,
            content: "Simplify: (3x²)(2x³)",
            options: ["6x⁵", "5x⁵", "6x⁶", "5x⁶"],
            correctAnswer: "6x⁵",
            points: 5,
            order: 3,
          },
          // Essay questions
          {
            examId: newExam.id,
            type: "essay" as const,
            content: "Explain the Pythagorean theorem and provide a real-world example of where it might be used.",
            modelAnswer: "The Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides. This can be written as a² + b² = c², where c is the hypotenuse and a and b are the other two sides. Real-world examples include: construction (ensuring buildings have right angles), navigation (calculating distances), and surveying (measuring land).",
            points: 10,
            order: 4,
          },
          {
            examId: newExam.id,
            type: "essay" as const,
            content: "Describe how quadratic equations can be used to solve real-world problems. Provide at least two different examples.",
            modelAnswer: "Quadratic equations (ax² + bx + c = 0) are used to model many real-world situations where there is a maximum or minimum value. Examples include: 1) Physics - calculating the trajectory of a projectile, where the equation represents the height of an object over time; 2) Business - determining optimal pricing to maximize profit, where the equation models revenue based on price changes; 3) Engineering - designing parabolic shapes for satellite dishes or bridges; 4) Finance - calculating compound interest or investment growth over time.",
            points: 10,
            order: 5,
          },
        ];

        await db.insert(questions).values(sampleQuestions);
      }

      // Create another sample exam
      const [scienceExam] = await db.insert(exams).values({
        teacherId: teacher.id,
        title: "Science Midterm Exam",
        description: "Biology and chemistry concepts covered this semester",
        duration: 60,
        displayMode: "all_at_once",
        examCode: "SCI2024",
        status: "active",
        isActive: true,
        startTime: new Date(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }).returning();

      if (scienceExam) {
        const scienceQuestions = [
          {
            examId: scienceExam.id,
            type: "multiple_choice" as const,
            content: "What is the chemical formula for water?",
            options: ["H₂O", "CO₂", "O₂", "H₂O₂"],
            correctAnswer: "H₂O",
            points: 3,
            order: 1,
          },
          {
            examId: scienceExam.id,
            type: "multiple_choice" as const,
            content: "Which organelle is known as the 'powerhouse' of the cell?",
            options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic reticulum"],
            correctAnswer: "Mitochondria",
            points: 3,
            order: 2,
          },
          {
            examId: scienceExam.id,
            type: "essay" as const,
            content: "Explain the process of photosynthesis and its importance to life on Earth.",
            modelAnswer: "Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy. The process occurs in chloroplasts and involves: 1) Light absorption by chlorophyll; 2) Conversion of carbon dioxide and water into glucose and oxygen; 3) The overall equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Photosynthesis is crucial because: it produces oxygen that most organisms need to breathe, it forms the base of most food chains, and it helps regulate Earth's carbon dioxide levels, impacting climate.",
            points: 8,
            order: 3,
          },
        ];

        await db.insert(questions).values(scienceQuestions);
      }
    }

    console.log("✅ Exam data seeded successfully!");
    console.log(`📚 Created ${sampleStudents.length} students`);
    console.log(`📝 Created sample exams with questions`);
  } catch (error) {
    console.error("❌ Error seeding exam data:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedExamData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedExamData };