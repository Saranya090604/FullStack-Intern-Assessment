require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function hash(password) {
  return bcrypt.hash(password, 10);
}

async function main() {
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "System Administrator User",
      email: "admin@storerating.com",
      password: await hash("Admin@1234"),
      address: "100 Administration Plaza, Central Business District, Metro City",
      role: "ADMIN",
    },
  });

  const ownerOne = await prisma.user.create({
    data: {
      name: "Primary Store Owner Account",
      email: "owner1@storerating.com",
      password: await hash("Owner@1234"),
      address: "22 Market Street, Downtown Shopping Corridor, Metro City",
      role: "STORE_OWNER",
    },
  });

  const ownerTwo = await prisma.user.create({
    data: {
      name: "Secondary Store Owner Account",
      email: "owner2@storerating.com",
      password: await hash("Owner@1234"),
      address: "88 Harbor Avenue, Riverside Commercial Park, Metro City",
      role: "STORE_OWNER",
    },
  });

  const userOne = await prisma.user.create({
    data: {
      name: "Normal Registered User One",
      email: "user1@storerating.com",
      password: await hash("User@1234!"),
      address: "14 Oak Lane, Greenfield Residential Area, Metro City",
      role: "USER",
    },
  });

  const userTwo = await prisma.user.create({
    data: {
      name: "Normal Registered User Two",
      email: "user2@storerating.com",
      password: await hash("User@1234!"),
      address: "57 Maple Court, Lakeside Neighborhood, Metro City",
      role: "USER",
    },
  });

  const storeOne = await prisma.store.create({
    data: {
      name: "Downtown Fresh Grocery Mart",
      email: "downtown.grocery@storerating.com",
      address: "22 Market Street, Downtown Shopping Corridor, Metro City",
      ownerId: ownerOne.id,
    },
  });

  const storeTwo = await prisma.store.create({
    data: {
      name: "Harbor View Electronics Hub",
      email: "harbor.electronics@storerating.com",
      address: "88 Harbor Avenue, Riverside Commercial Park, Metro City",
      ownerId: ownerTwo.id,
    },
  });

  await prisma.rating.createMany({
    data: [
      { userId: userOne.id, storeId: storeOne.id, rating: 5 },
      { userId: userTwo.id, storeId: storeOne.id, rating: 4 },
      { userId: userOne.id, storeId: storeTwo.id, rating: 3 },
      { userId: userTwo.id, storeId: storeTwo.id, rating: 5 },
    ],
  });

  console.log("Seed complete.");
  console.log("Admin:  admin@storerating.com / Admin@1234");
  console.log("Owner1: owner1@storerating.com / Owner@1234");
  console.log("Owner2: owner2@storerating.com / Owner@1234");
  console.log("User1:  user1@storerating.com / User@1234!");
  console.log("User2:  user2@storerating.com / User@1234!");
  console.log(`Created users: ${admin.email}, stores: ${storeOne.name}, ${storeTwo.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
