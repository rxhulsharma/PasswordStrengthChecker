// --- scripts/main.js ---
// Uses global calculateEntropy() from entropyCrack.js

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("passwordInput");
  const strengthText = document.getElementById("strengthText");
  const meterCanvas = document.getElementById("strengthMeter");
  const ctx = meterCanvas ? meterCanvas.getContext("2d") : null;

  const breachResult = document.getElementById("breachResult");
  const entropyText = document.getElementById("entropyText");
  const crackTimeText = document.getElementById("crackTime");
  const proceedBtn = document.getElementById("proceedBtn");
  const warningText = document.getElementById("warningInline");

  if (!passwordInput) {
    console.error("passwordInput element not found. Check your HTML IDs.");
    return;
  }

  if (typeof drawMeter === "function" && ctx) {
    drawMeter(ctx, 0);
  }

  function showWarning(msg) {
    if (!warningText) return;
    warningText.textContent = `⚠ ${msg}`;
    warningText.style.display = "inline";
  }

  function hideWarning() {
    if (!warningText) return;
    warningText.style.display = "none";
  }

  passwordInput.addEventListener("input", async () => {
    const pass = passwordInput.value.trim();
    if (pass.length > 0) hideWarning();

    // Strength scoring
    let score = 0;
    if (typeof evaluateStrength === "function") score = evaluateStrength(pass);
    if (typeof updatePolicy === "function") updatePolicy(pass);
    if (typeof updateTips === "function") updateTips(score);
    if (typeof animateMeter === "function" && ctx) animateMeter(ctx, score);

    if (strengthText) {
      strengthText.textContent =
        score < 40 ? "Strength: Weak" :
        score < 80 ? "Strength: Medium" :
        "Strength: Strong";
    }

    // Entropy & crack time (old logic)
    if (typeof calculateEntropy === "function") {
      const res = calculateEntropy(pass);
      if (entropyText) entropyText.textContent = `Entropy: ${res.entropy.toFixed(2)} bits`;
      if (crackTimeText) crackTimeText.textContent = `Estimated crack time: ${res.crackTime}`;
    }

    // Breach check (if helper is present)
    if (breachResult) {
      if (pass.length > 0 && typeof checkPasswordBreach === "function") {
        try {
          const count = await checkPasswordBreach(pass);
          breachResult.innerHTML =
            count > 0
              ? `⚠️ Found <b>${count.toLocaleString()}</b> times in breaches`
              : `✅ This password is safe!`;
        } catch (err) {
          console.error("Breach check failed:", err);
          breachResult.textContent = "—";
        }
      } else {
        breachResult.textContent = "—";
      }
    }
  });

  // Toggle show/hide password
  const toggleBtn = document.getElementById("toggleBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });
  }

  // Generate password
  const generateBtn = document.getElementById("generateBtn");
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      if (typeof generatePassword === "function") {
        const newPass = generatePassword();
        const genField = document.getElementById("generatedPass");
        if (genField) genField.value = newPass;
        passwordInput.value = newPass;
        passwordInput.dispatchEvent(new Event("input"));
      } else {
        console.warn("generatePassword() not found.");
      }
    });
  }

  // Copy generated password
  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const field = document.getElementById("generatedPass");
      if (!field || !field.value) return;
      field.select();
      navigator.clipboard.writeText(field.value).catch(err => {
        console.error("Copy failed:", err);
      });
    });
  }

  // Proceed
  if (proceedBtn) {
    proceedBtn.addEventListener("click", (e) => {
      const pass = passwordInput.value.trim();
      const score = typeof evaluateStrength === "function" ? evaluateStrength(pass) : 0;

      if (!pass) {
        e.preventDefault();
        showWarning("Please enter a password first.");
        return;
      }
      if (score < 60) {
        e.preventDefault();
        showWarning("Password not secure enough.");
        return;
      }
      window.location.href = "feedback.html";
    });
  }

  hideWarning();
});
