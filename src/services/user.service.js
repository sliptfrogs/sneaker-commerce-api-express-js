import { sequelize } from "../config/SequelizeORM.js";
import { FakeBankAccount, User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.util.js";

export const getAllUsers = async () => {
  const users = await User.findAll({
    include: [
      {
        model: FakeBankAccount,
        as: "bankAccount"
      },
    ],
  });

  if (users.length === 0) {
    throw new ApiError("No users found", 404);
  }
  return users;
};
export const createUserService = async (userData) => {
  const user = await User.create(userData);
  if (!user) {
    throw new ApiError("User creation failed", 500);
  }
  return user;
};
export const findUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
  } catch (error) {
    throw new ApiError(error.message, error.statusMessage);
  }
};
export const createFakeBankAccountService = async (userId, bankData) => {
  const t = await sequelize.transaction();
  try {
    await findUserById(userId);

    await FakeBankAccount.create(
      {
        user_id: userId,
        card_number: bankData.card_number,
        balance: bankData.balance,
      },
      { transaction: t },
    );
    await t.commit();

    return;
  } catch (error) {
    await t.rollback();
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
