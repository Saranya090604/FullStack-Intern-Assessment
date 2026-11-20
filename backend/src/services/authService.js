const { prisma } = require("../config/db");
const { AppError } = require("../utils/AppError");
const { hashPassword, comparePassword, signToken, publicUser } = require("../utils/password");

async function signup(data) {
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
      role: "USER",
    },
  });

  const token = signToken({ id: user.id, role: user.role });
  return { token, user: publicUser(user) };
}

async function login(data) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const ok = await comparePassword(data.password, user.password);
  if (!ok) {
    throw new AppError("Invalid email or password", 401);
  }
  const token = signToken({ id: user.id, role: user.role });
  return { token, user: publicUser(user) };
}

async function updatePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const ok = await comparePassword(currentPassword, user.password);
  if (!ok) {
    throw new AppError("Current password is incorrect", 400);
  }
  await prisma.user.update({
    where: { id: userId },
    data: { password: await hashPassword(newPassword) },
  });
}

module.exports = { signup, login, updatePassword };
