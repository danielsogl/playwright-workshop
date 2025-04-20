import fs from 'fs'; // Import fs for file reading
import path from 'path'; // Import path for resolving file path

import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import bcrypt from 'bcryptjs'; // For password hashing

import { User } from '../models/user';

// Define the structure of the data file
interface SeedData {
  users: Array<{
    id: string;
    email: string;
    name?: string | null;
    password: string;
  }>;
  // Add other data types like publicNews, privateNewsFeeds later
}

// In-memory store for users
const users = new Map<string, User>();

// Define functions before calling seedUsers to avoid initialization errors

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

  const hashedPassword = await bcrypt.hash(userData.password, 10);
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

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new Error('Incorrect current password');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
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
  data: Partial<Pick<User, 'name'>>, // Allows updating only specific fields like 'name'
): Promise<User> => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Merge existing user data with new data
  const updatedUser: User = {
    ...user,
    ...data, // Overwrite fields provided in data
  };

  users.set(userId, updatedUser);

  return updatedUser;
};

// TODO: Add functions for updating and deleting users if needed for the settings page.

// --- Seeding Logic ---

// Function to load seed data from JSON file
const loadSeedData = (): SeedData | null => {
  try {
    const filePath = path.resolve(process.cwd(), 'config/data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    return JSON.parse(fileContent) as SeedData;
  } catch {
    return null;
  }
};

// Seed users from the JSON file
const seedUsers = async () => {
  const seedData = loadSeedData();

  if (!seedData || !seedData.users) {
    return;
  }

  for (const seedUser of seedData.users) {
    // Now findUserByEmail is defined before this call
    const existingUser = await findUserByEmail(seedUser.email);

    if (!existingUser) {
      try {
        const hashedPassword = await bcrypt.hash(seedUser.password, 10);
        // Use the ID from the seed file or generate a new one if needed
        const userId = seedUser.id || uuidv4();
        const newUser: User = {
          id: userId,
          email: seedUser.email,
          name: seedUser.name,
          passwordHash: hashedPassword,
        };

        users.set(userId, newUser);
      } catch {
        // Consider adding more robust error handling/logging here in a real app
      }
    } else {
      // User already exists, skip seeding
    }
  }
};

// Initialize seed data after functions are defined
seedUsers();

export interface UserData {
  id: string;
  email: string;
  name: string;
  password: string;
}
