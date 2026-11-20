const { prisma } = require("../config/db");
const { AppError } = require("../utils/AppError");
const { roundAvg } = require("../utils/query");

async function getDashboard(ownerId, query) {
  const store = await prisma.store.findUnique({
    where: { ownerId },
    include: {
      ratings: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!store) {
    throw new AppError("No store is linked to this owner account", 404);
  }

  const averageRating =
    store.ratings.length === 0
      ? 0
      : roundAvg(store.ratings.reduce((sum, item) => sum + item.rating, 0) / store.ratings.length);

  let raters = store.ratings.map((item) => ({
    id: item.id,
    name: item.user.name,
    email: item.user.email,
    rating: item.rating,
    date: item.updatedAt,
  }));

  const sortBy = ["name", "email", "rating", "date"].includes(query.sortBy) ? query.sortBy : "name";
  const dir = String(query.order || "asc").toLowerCase() === "desc" ? -1 : 1;
  raters = raters.sort((a, b) => {
    if (sortBy === "rating") return (a.rating - b.rating) * dir;
    if (sortBy === "date") return (new Date(a.date) - new Date(b.date)) * dir;
    return String(a[sortBy]).localeCompare(String(b[sortBy])) * dir;
  });

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
    },
    averageRating,
    ratingsCount: store.ratings.length,
    raters,
  };
}

module.exports = { getDashboard };
