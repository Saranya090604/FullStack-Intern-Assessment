const SPECIAL = /[!@#$%^&*(),.?":{}|<>]/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name) {
  const value = (name || "").trim();
  if (value.length < 20) return "Name must be at least 20 characters";
  if (value.length > 60) return "Name must be at most 60 characters";
  return "";
}

export function validateAddress(address) {
  const value = (address || "").trim();
  if (!value) return "Address is required";
  if (value.length > 400) return "Address must be at most 400 characters";
  return "";
}

export function validateEmail(email) {
  const value = (email || "").trim();
  if (!value) return "Email is required";
  if (!EMAIL.test(value)) return "Enter a valid email address";
  return "";
}

export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8 || password.length > 16) return "Password must be 8 to 16 characters";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter";
  if (!SPECIAL.test(password)) {
    return 'Password must include at least one special character (!@#$%^&*(),.?":{}|<>)';
  }
  return "";
}

export function validateRating(rating) {
  const value = Number(rating);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return "Rating must be an integer between 1 and 5";
  }
  return "";
}

export function fieldErrors(fields) {
  const errors = {};
  Object.entries(fields).forEach(([key, result]) => {
    if (result) errors[key] = result;
  });
  return errors;
}
