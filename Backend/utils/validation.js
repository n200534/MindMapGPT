const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.trim().length >= 2;
};

const validateMindMapTitle = (title) => {
  return title && title.trim().length >= 1;
};

const validatePrompt = (prompt) => {
  return prompt && prompt.trim().length >= 10;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateMindMapTitle,
  validatePrompt
}; 