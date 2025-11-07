// --- proceedGuard.js (or paste inside DOMContentLoaded in main.js) ---
(function () {
  const proceedBtn = document.getElementById('proceedBtn');
  const passwordInput = document.getElementById('passwordInput');
  const strengthText = document.getElementById('strengthText');

  // If you want a different threshold, change this (0-100)
  const MIN_SCORE_TO_PROCEED = 60;

  // Create (or reuse) a small inline helper message under the strength text
  let helper = document.getElementById('proceedHelper');
  if (!helper) {
    helper = document.createElement('div');
    helper.id = 'proceedHelper';
    helper.style.marginTop = '6px';
    helper.style.fontSize = '0.95rem';
    helper.style.color = '#f6c0c0'; // light red for warnings
    // Insert after strengthText if present
    if (strengthText && strengthText.parentNode) {
      strengthText.parentNode.insertBefore(helper, strengthText.nextSibling);
    }
  }

  // Disable proceed initially
  function setProceedDisabled(disabled, reasonText = '') {
    proceedBtn.disabled = disabled;
    if (disabled) {
      proceedBtn.classList.add('disabled');
      helper.textContent = reasonText;
    } else {
      proceedBtn.classList.remove('disabled');
      helper.textContent = '';
    }
  }

  // Evaluate and update proceed state (call this on input and at startup)
  function updateProceedState() {
    const pwd = (passwordInput.value || '').trim();

    if (!pwd) {
      setProceedDisabled(true, 'Please enter a password before proceeding.');
      return;
    }

    // Use your existing evaluateStrength() function to get a score 0-100
    let score = 0;
    try {
      score = typeof evaluateStrength === 'function' ? evaluateStrength(pwd) : 0;
    } catch (err) {
      score = 0;
      console.warn('evaluateStrength failed:', err);
    }

    if (score < MIN_SCORE_TO_PROCEED) {
      setProceedDisabled(true, `Password not secure enough (score ${Math.round(score)}%). Make it longer and add numbers/symbols.`);
      return;
    }

    // ok to proceed
    setProceedDisabled(false, '');
  }

  // Prevent accidental navigation if button is somehow clicked/activated
  proceedBtn.addEventListener('click', (e) => {
    if (proceedBtn.disabled) {
      e.preventDefault();
      // Friendly alert (you can substitute with a toast/modal if you have one)
      const msg = helper.textContent || 'Password not secure or empty — please fix it before proceeding.';
      // Use a non-blocking UI if you prefer; simple alert is reliable:
      alert(msg);
    } else {
      // normal behaviour: navigate to feedback page (if your button uses window.location in markup)
      // If the button has inline navigation already (onclick), you can let it run.
      // If you prefer JS redirection, uncomment below:
      // window.location.href = 'feedback.html';
    }
  });

  // Run on every input change
  passwordInput.addEventListener('input', updateProceedState);

  // init
  updateProceedState();
})();
