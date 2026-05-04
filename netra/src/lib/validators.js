/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
 * @param {string} password
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validatePassword(password) {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate name
 * @param {string} name
 * @returns {boolean}
 */
export function isValidName(name) {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * Sanitize input to prevent injection
 * @param {string} input
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (!input) return "";
  return input.trim().replace(/[<>]/g, "");
}
