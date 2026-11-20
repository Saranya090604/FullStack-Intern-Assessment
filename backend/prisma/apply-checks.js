require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function applyChecks() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE ratings
    ADD CONSTRAINT ratings_rating_range
    CHECK (rating >= 1 AND rating <= 5)
  `);
  console.log("Added CHECK constraint: ratings.rating BETWEEN 1 AND 5");
}

applyChecks()
  .catch((error) => {
    const message = String(error.message || error);
    if (message.includes("Duplicate") || message.includes("already exists") || message.includes("check constraint")) {
      console.log("CHECK constraint already present (or MySQL skipped a duplicate).");
      return;
    }
    console.warn("Could not add CHECK constraint:", message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
