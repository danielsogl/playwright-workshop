import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcryptjs';

import { User } from '../models/user';
import { loadSeedData } from '../services/data-service';

const users = new Map<string, User>();

/**
 * Finds a user by their email address.
 * @param email - The email address to search for.
 * @returns The user object if found, otherwise undefined.
 */
export const findUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }

  return undefined;
};

/**
 * Finds a user by their ID.
 * @param id - The user ID to search for.
 * @returns The user object if found, otherwise undefined.
 */
export const findUserById = async (id: string): Promise<User | undefined> => {
  return users.get(id);
};

/**
 * Adds a new user to the store.
 * @param userData - The user data (email, password, name).
 * @returns The newly created user object.
 * @throws Error if the email already exists.
 */
export const addUser = async (
  userData: Omit<User, 'id' | 'passwordHash'> & { password: string },
): Promise<User> => {
  const existingUser = await findUserByEmail(userData.email);

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hash(userData.password, 10);
  const userId = uuidv4();
  const newUser: User = {
    id: userId,
    email: userData.email,
    name: userData.name,
    passwordHash: hashedPassword,
  };

  users.set(userId, newUser);

  return newUser;
};

/**
 * Updates a user's password after verifying the current password.
 * @param userId - The ID of the user to update.
 * @param currentPassword - The user's current password.
 * @param newPassword - The new password to set.
 * @returns True if the update was successful, false otherwise.
 * @throws Error if the user is not found or current password doesn't match.
 */
export const updateUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await compare(
    currentPassword,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new Error('Incorrect current password');
  }

  const newPasswordHash = await hash(newPassword, 10);
  const updatedUser: User = {
    ...user,
    passwordHash: newPasswordHash,
  };

  users.set(userId, updatedUser);

  return true;
};

/**
 * Updates a user's profile information (currently only name).
 * @param userId - The ID of the user to update.
 * @param data - The data to update (e.g., { name: string }).
 * @returns The updated user object.
 * @throws Error if the user is not found.
 */
export const updateUserProfile = async (
  userId: string,
  data: Partial<Pick<User, 'name'>>,
): Promise<User> => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser: User = {
    ...user,
    ...data,
  };

  users.set(userId, updatedUser);

  return updatedUser;
};

const seedUsers = async () => {
  const seedData = loadSeedData();

  if (!seedData?.users) {
    return;
  }

  for (const seedUser of seedData.users) {
    const existingUser = await findUserByEmail(seedUser.email);

    if (!existingUser) {
      try {
        const hashedPassword = await hash(seedUser.password, 10);
        const userId = seedUser.id || uuidv4();
        const newUser: User = {
          id: userId,
          email: seedUser.email,
          name: seedUser.name,
          passwordHash: hashedPassword,
        };

        users.set(userId, newUser);
      } catch (error) {
        console.error(`Failed to seed user ${seedUser.email}:`, error);
      }
    }
  }
};

seedUsers();
