// strength.js - returns a 0..100 percent strength score
function evaluateStrength(password) {
  // count rules satisfied (0..5)
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // convert to percent 0..100
  return Math.round((score / 5) * 100);
}
