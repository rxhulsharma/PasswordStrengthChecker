// ============================
// Meaningful Strong Password (8–12 chars)
// ============================

function generateStrongPassword() {

  const words = [
    "river","cloud","stone","quiet","ember","nova","sage","lumen","green","silver",
    "poppy","orchid","maple","breeze","echo","atlas","cinder","marble","willow","harbor",
    "oak","cedar","sun","moon","star","crest","field","brook","ridge","glade"
  ];

  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}<>?";

  function rnd(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randDigit() {
    return Math.floor(Math.random() * 10).toString();
  }

  function randSpecial() {
    return "!@#$%^&*()_+-=[]{}<>?".charAt(Math.floor(Math.random() * 20));
  }

  // Pick 1 or 2 random words
  let parts = [rnd(words)];
  if (Math.random() > 0.5) parts.push(rnd(words));

  // Capitalize one of them
  const capIndex = Math.floor(Math.random() * parts.length);
  parts[capIndex] = parts[capIndex][0].toUpperCase() + parts[capIndex].slice(1);

  let candidate = parts.join("");

  // Add a digit + special character
  candidate += randDigit() + randSpecial();

  // ✅ Target random length between 8–12
  const targetLength = Math.floor(Math.random() * 5) + 8; // 8 to 12

  // Extend if too short
  while (candidate.length < targetLength) {
    candidate += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Trim if too long
  if (candidate.length > targetLength) {
    candidate = candidate.slice(0, targetLength);
  }

  // ✅ Check policy
  const valid =
    candidate.length >= 8 &&
    /[A-Z]/.test(candidate) &&
    /[a-z]/.test(candidate) &&
    /\d/.test(candidate) &&
    /[^A-Za-z0-9]/.test(candidate);

  // If still fails, generate random fallback
  if (!valid) {
    let pwd = "";
    while (pwd.length < targetLength) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  }

  return candidate;
}

// Expose globally so main.js can access
window.generatePassword = generateStrongPassword;
