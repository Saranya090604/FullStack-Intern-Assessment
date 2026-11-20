const { prisma } = require("../config/db");
const { containsFilter, sortOrder, roundAvg } = require("../utils/query");

async function listStoresForUser(userId, query) {
  const where = {
    AND: [
      containsFilter(query.name) ? { name: containsFilter(query.name) } : {},
      containsFilter(query.address) ? { address: containsFilter(query.address) } : {},
    ],
  };

  const stores = await prisma.store.findMany({
    where,
    include: {
      ratings: { select: { rating: true, userId: true } },
    },
    orderBy: sortOrder(query, ["name", "address", "createdAt"], "name"),
  });

  let rows = stores.map((store) => {
    const avg =
      store.ratings.length === 0
        ? 0
        : store.ratings.reduce((sum, item) => sum + item.rating, 0) / store.ratings.length;
    const mine = store.ratings.find((item) => item.userId === userId);
    return {
      id: store.id,
      name: store.name,
      address: store.address,
      averageRating: roundAvg(avg),
      ratingsCount: store.ratings.length,
      userRating: mine ? mine.rating : null,
    };
  });

  if (query.sortBy === "rating" || query.sortBy === "averageRating") {
    const dir = String(query.order || "asc").toLowerCase() === "desc" ? -1 : 1;
    rows = rows.sort((a, b) => (a.averageRating - b.averageRating) * dir);
  }

  return rows;
}

module.exports = { listStoresForUser };
