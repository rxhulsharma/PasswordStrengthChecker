// --- scripts/entropyCrack.js ---
// Calculates exact entropy and exact crack time (no approximations)

function calculateEntropy(password) {
  if (!password) return { entropy: 0, crackSeconds: 0, crackTime: "0 seconds" };

  let charset = 0;
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/\d/.test(password)) charset += 10;
  if (/[^A-Za-z0-9]/.test(password)) charset += 33;
  if (charset <= 0) charset = 1;

  const entropy = password.length * Math.log2(charset);

  // Base guesses/sec (modern GPU assumption)
  const guessesPerSecond = 1e9;

  // Compute 2^entropy safely; if it overflows, treat as Infinity
  const totalCombinations = Math.pow(2, entropy);
  const crackSeconds = isFinite(totalCombinations)
    ? totalCombinations / guessesPerSecond
    : Infinity;

  return {
    entropy: entropy,
    crackSeconds: crackSeconds,
    crackTime: formatExactTime(crackSeconds),
  };
}

function formatExactTime(seconds) {
  const minute = 60, hour = 3600, day = 86400, year = 31557600;

  if (!isFinite(seconds)) return "∞ seconds";
  if (seconds < minute) return `${seconds.toFixed(3)} seconds`;
  if (seconds < hour) return `${(seconds / minute).toFixed(3)} minutes`;
  if (seconds < day) return `${(seconds / hour).toFixed(3)} hours`;
  if (seconds < year) return `${(seconds / day).toFixed(3)} days`;

  const years = seconds / year;
  return years < 1e6 ? `${years.toFixed(3)} years` : `${years.toExponential(4)} years`;
}
