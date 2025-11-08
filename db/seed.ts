import { seedExamData } from "./seed/exam-seed";

async function runSeeds() {
  try {
    console.log("🚀 Starting database seeding...");

    await seedExamData();

    console.log("🎉 All seeds completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  }
}

// Run seeds if this file is executed directly
if (require.main === module) {
  runSeeds();
}

export { runSeeds };