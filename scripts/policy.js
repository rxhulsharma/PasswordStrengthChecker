// policy.js - updates policy list items (adds/remove ✅/❌)
function updatePolicy(password) {
  const checks = {
    lengthRule: password.length >= 8,
    upperRule: /[A-Z]/.test(password),
    lowerRule: /[a-z]/.test(password),
    numberRule: /\d/.test(password),
    specialRule: /[^A-Za-z0-9]/.test(password),
  };

  Object.keys(checks).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (checks[id]) {
      // show green check if not already
      el.textContent = `✅ ${el.textContent.replace(/^✅ |^❌ /, '')}`;
      el.classList.add('valid');
      el.classList.remove('invalid');
    } else {
      el.textContent = `❌ ${el.textContent.replace(/^✅ |^❌ /, '')}`;
      el.classList.add('invalid');
      el.classList.remove('valid');
    }
  });
}
