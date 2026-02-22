import { FakeBankAccount, User, UserProfile } from '../models/index.js';
import { ApiError } from '../utils/ApiError.util.js';
import { sequelize } from '../config/SequelizeORM.js';
import { GeneratePassword } from '../utils/PasswordGeneration.util.js';
import bcrypt from 'bcrypt';
import { generateTokens, verifyAccessToken } from '../utils/jwt.js';

export const authRegisterService = async (userReq) => {
  const t = await sequelize.transaction();

  try {
    const [user, created] = await User.findOrCreate({
      where: {
        email: userReq.email,
      },
      defaults: {
        email: userReq?.email,
        password_hash: await GeneratePassword(userReq?.password_hash),
        role: userReq?.role,
      },
      transaction: t,
    });

    if (!created) {
      throw new ApiError('Email already exist', 409);
    }

    await UserProfile.create(
      {
        first_name: userReq?.first_name,
        last_name: userReq?.last_name,
        user_id: user.id,
        phone_number: userReq?.phone_number,
        avartar_url: userReq?.avartar_url,
      },
      {
        transaction: t,
      },
    );

    await t.commit();

    return;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
export const authLoginService = async (userReq) => {
  try {
    const user = await User.findOne({
      where: { email: userReq.email },
      attributes: ['id', 'email', 'role', 'password_hash'],
      include: [
        {
          model: UserProfile,
          as: 'profile',
          attributes: ['first_name', 'last_name'],
        },
        {
          model: FakeBankAccount,
          as: 'bankAccount',
          attributes: ['balance', 'card_number'],
        },
      ],
    });

    if (!user) throw new ApiError('User not found', 404);

    const isMatch = await bcrypt.compare(
      userReq.password_hash,
      user.password_hash,
    );

    if (!isMatch) {
      throw new ApiError('Invalid email or password', 401);
    }

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      id: user.id,
      email: user.email,
      balance: user.bankAccount ? user.bankAccount.balance : 0,
      profile: user.profile,
      currency: 'USD',
      role: user.role,
      tokens,
    };
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
