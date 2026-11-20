const { prisma } = require("../config/db");
const { AppError } = require("../utils/AppError");
const { hashPassword, publicUser } = require("../utils/password");
const { containsFilter, sortOrder, roundAvg } = require("../utils/query");

async function getStats() {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  return { totalUsers, totalStores, totalRatings };
}

async function createUser(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError("Email is already registered", 409);
  }
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      address: data.address,
      password: await hashPassword(data.password),
      role: data.role,
    },
  });
  return publicUser(user);
}

async function createStore(data) {
  const owner = await prisma.user.findUnique({ where: { id: data.ownerId } });
  if (!owner) {
    throw new AppError("Store owner not found", 404);
  }
  if (owner.role !== "STORE_OWNER") {
    throw new AppError("Linked user must have the STORE_OWNER role", 400);
  }
  const existingStore = await prisma.store.findUnique({ where: { ownerId: data.ownerId } });
  if (existingStore) {
    throw new AppError("This store owner already has a store", 409);
  }
  return prisma.store.create({
    data: {
      name: data.name,
      email: data.email,
      address: data.address,
      ownerId: data.ownerId,
    },
  });
}

async function listStores(query) {
  const where = {
    AND: [
      containsFilter(query.name) ? { name: containsFilter(query.name) } : {},
      containsFilter(query.email) ? { email: containsFilter(query.email) } : {},
      containsFilter(query.address) ? { address: containsFilter(query.address) } : {},
    ],
  };

  const stores = await prisma.store.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      ratings: { select: { rating: true } },
    },
    orderBy: sortOrder(query, ["name", "email", "address", "createdAt"], "name"),
  });

  let rows = stores.map((store) => {
    const avg =
      store.ratings.length === 0
        ? 0
        : store.ratings.reduce((sum, item) => sum + item.rating, 0) / store.ratings.length;
    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      owner: store.owner,
      averageRating: roundAvg(avg),
      ratingsCount: store.ratings.length,
    };
  });

  if (query.sortBy === "rating" || query.sortBy === "averageRating") {
    const dir = String(query.order || "asc").toLowerCase() === "desc" ? -1 : 1;
    rows = rows.sort((a, b) => (a.averageRating - b.averageRating) * dir);
  }

  return rows;
}

async function listUsers(query) {
  const where = {
    AND: [
      containsFilter(query.name) ? { name: containsFilter(query.name) } : {},
      containsFilter(query.email) ? { email: containsFilter(query.email) } : {},
      containsFilter(query.address) ? { address: containsFilter(query.address) } : {},
      ["ADMIN", "USER", "STORE_OWNER"].includes(String(query.role || "").toUpperCase())
        ? { role: String(query.role).toUpperCase() }
        : {},
    ],
  };

  const users = await prisma.user.findMany({
    where,
    orderBy: sortOrder(query, ["name", "email", "address", "role", "createdAt"], "name"),
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });
  return users;
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      store: {
        include: { ratings: { select: { rating: true } } },
      },
    },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const result = publicUser(user);
  if (user.role === "STORE_OWNER") {
    if (!user.store) {
      result.store = null;
      result.averageRating = 0;
    } else {
      const avg =
        user.store.ratings.length === 0
          ? 0
          : user.store.ratings.reduce((sum, item) => sum + item.rating, 0) / user.store.ratings.length;
      result.store = {
        id: user.store.id,
        name: user.store.name,
        email: user.store.email,
        address: user.store.address,
      };
      result.averageRating = roundAvg(avg);
    }
  }
  return result;
}

async function listStoreOwnersWithoutStore() {
  return prisma.user.findMany({
    where: { role: "STORE_OWNER", store: null },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

module.exports = {
  getStats,
  createUser,
  createStore,
  listStores,
  listUsers,
  getUserById,
  listStoreOwnersWithoutStore,
};
