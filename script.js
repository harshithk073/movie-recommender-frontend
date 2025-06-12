const recommendBtn = document.getElementById('recommendBtn');
const userMovieInput = document.getElementById('userMovieInput');
const recommendationResults = document.getElementById('recommendationResults');

recommendBtn.addEventListener('click', () => {
  const movieTitle = userMovieInput.value.trim();
  recommendationResults.innerHTML = '';
  if (!movieTitle) {
    recommendationResults.innerHTML = `<div class="movie-card">Please enter a movie title!</div>`;
    return;
  }
  recommendBtn.disabled = true;
  recommendBtn.textContent = "Loading...";
  fetch('https://movie-recommender-backend-khmo.onrender.com/recommend', {  // Updated backend URL here
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movie_title: movieTitle })
  })
  .then(res => res.json())
  .then(data => {
    recommendBtn.disabled = false;
    recommendBtn.textContent = "Recommend";
    if (data.recommendations && data.recommendations.length) {
      recommendationResults.innerHTML = data.recommendations
        .map((movie, idx) => `
          <div class="movie-card" data-index="${idx}">
            <div class="movie-title">${movie.title}</div>
            ${movie.tagline ? `<div class="movie-tagline">${movie.tagline}</div>` : ""}
            <div class="movie-meta">
              ${movie.genres ? `<span>${movie.genres}</span><br>` : ""}
              ${movie.year ? `<span>${movie.year}</span><br>` : ""}
              ${movie.rating ? `<span>⭐ ${movie.rating}</span><br>` : ""}
              ${movie.director ? `<span>🎬 ${movie.director}</span>` : ""}
            </div>
            <div class="movie-overview">${movie.overview || "No overview available."}</div>
          </div>
        `).join('');
      // Show only one overview at a time for less clutter
      document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', function(e) {
          document.querySelectorAll('.movie-card.expanded').forEach(c => {
            if (c !== this) c.classList.remove('expanded');
          });
          this.classList.toggle('expanded');
        });
      });
    } else {
      recommendationResults.innerHTML = `<div class="movie-card">No recommendations found for "${movieTitle}".</div>`;
    }
  })
  .catch(() => {
    recommendBtn.disabled = false;
    recommendBtn.textContent = "Recommend";
    recommendationResults.innerHTML = `<div class="movie-card">Error connecting to the recommendation engine.</div>`;
  });
});

// Allow Enter key to submit
userMovieInput.addEventListener('keydown', function(e) {
  if (e.key === "Enter") {
    recommendBtn.click();
  }
});
