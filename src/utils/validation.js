// utils/validation.js

// Email validation
export const validateEmail = (email) => {
  if (!email) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Enter a valid email address.";
  return null;
};

// Password validation
export const validatePassword = (password, minLength = 6) => {
  if (!password) return "Password is required.";
  if (password.length < minLength)
    return `Password must be at least ${minLength} characters.`;
  return null;
};

// Common form validator (for multiple fields at once)
export const validateForm = (fields) => {
  const errors = {};
  for (const [key, { value, rules }] of Object.entries(fields)) {
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[key] = error;
        break; // stop at first error for that field
      }
    }
  }
  return errors;
};
