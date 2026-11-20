const { prisma } = require("../config/db");
const { AppError } = require("../utils/AppError");

async function upsertRating(userId, storeId, rating) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw new AppError("Store not found", 404);
  }

  const saved = await prisma.rating.upsert({
    where: {
      userId_storeId: { userId, storeId },
    },
    update: { rating },
    create: { userId, storeId, rating },
  });

  return saved;
}

module.exports = { upsertRating };
