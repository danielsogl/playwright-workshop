export interface User {
  id: string;
  name?: string | null;
  email: string;
  passwordHash: string; // Store hashed passwords, not plain text
  // Add other user properties as needed, e.g., createdAt, updatedAt
}
