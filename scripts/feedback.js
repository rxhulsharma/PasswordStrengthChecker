document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star");
  let rating = 0;

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      rating = star.dataset.value;
      stars.forEach((s) => s.classList.remove("active"));
      star.classList.add("active");
      let index = Array.from(stars).indexOf(star);
      for (let i = 0; i <= index; i++) stars[i].classList.add("active");
    });
  });

  document.getElementById("feedbackForm").addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Thank you for your feedback! ⭐ Rating: ${rating || "No rating"} submitted.`);
    e.target.reset();
    stars.forEach((s) => s.classList.remove("active"));
  });
});
