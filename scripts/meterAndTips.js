// --- Password Strength Meter + Tips --- //
let currentPercent = 0;
let animationFrame;

// Draw strength meter
function drawMeter(ctx, percent) {
  const size = ctx.canvas.width;
  const center = size / 2;
  const radius = size * 0.42;

  ctx.clearRect(0, 0, size, size);

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (2 * Math.PI * percent) / 100;

  // background
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = size * 0.07;
  ctx.stroke();

  // active progress ring
  ctx.beginPath();
  ctx.arc(center, center, radius, startAngle, endAngle);
  ctx.strokeStyle =
    percent < 40 ? "#ef4444" : percent < 80 ? "#facc15" : "#22c55e";
  ctx.lineWidth = size * 0.07;
  ctx.lineCap = "round";
  ctx.stroke();

  // center text
  ctx.font = `bold ${size * 0.12}px Poppins`;
  ctx.fillStyle = "#4da6ff";
ctx.shadowColor = "#4da6ff";

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${Math.round(percent)}%`, center, center);
}

// Smooth animation
function animateMeter(ctx, target) {
  cancelAnimationFrame(animationFrame);
  function step() {
    const diff = target - currentPercent;
    if (Math.abs(diff) < 0.5) {
      currentPercent = target;
      drawMeter(ctx, currentPercent);
      return;
    }
    currentPercent += diff * 0.15;
    drawMeter(ctx, currentPercent);
    animationFrame = requestAnimationFrame(step);
  }
  step();
}

// Tips logic (simple & modular)
function updateTips(score) {
  const tips = document.getElementById("tipsText");
  if (!tips) return;
  if (score < 40)
    tips.textContent =
      "Try adding uppercase letters, numbers, or special symbols.";
  else if (score < 80)
    tips.textContent =
      "Almost there! Use more variety or length for stronger security.";
  else tips.textContent = "Excellent! Strong password.";
}
