import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash password using bcryptjs
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if matches, false otherwise
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a verification token
 * @returns {string} - Random token
 */
export function generateVerificationToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Get verification token expiration time (24 hours from now)
 * @returns {Date}
 */
export function getTokenExpiration() {
  const now = new Date();
  return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
}
