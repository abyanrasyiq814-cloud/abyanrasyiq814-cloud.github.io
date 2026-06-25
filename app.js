// Change this username to connect the portfolio with the correct GitHub account.
const GITHUB_USERNAME = "abyanfarisrasyiq";

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const repoGrid = document.getElementById("repoGrid");
const githubProfile = document.getElementById("githubProfile");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();
githubProfile.href = `https://github.com/${GITHUB_USERNAME}`;

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createRepoCard(repo) {
  const description = repo.description || "No description available yet.";
  const language = repo.language || "Repository";
  const stars = repo.stargazers_count || 0;
  const updatedAt = formatDate(repo.updated_at);

  return `
    <article class="repo-card">
      <div>
        <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${escapeHTML(repo.name)}</a></h3>
        <p>${escapeHTML(description)}</p>
      </div>
      <div class="repo-meta">
        <span>${escapeHTML(language)}</span>
        <span>★ ${stars}</span>
        <span>Updated ${updatedAt}</span>
      </div>
    </article>
  `;
}

async function loadGitHubRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);

    if (!response.ok) {
      throw new Error("GitHub profile or repositories could not be loaded.");
    }

    const repos = await response.json();

    if (!repos.length) {
      repoGrid.innerHTML = `<div class="repo-placeholder">No public repository found for ${GITHUB_USERNAME}. Try changing the username in app.js.</div>`;
      return;
    }

    repoGrid.innerHTML = repos.map(createRepoCard).join("");
  } catch (error) {
    repoGrid.innerHTML = `
      <div class="repo-placeholder">
        GitHub data failed to load. Open app.js and make sure GITHUB_USERNAME is correct.
      </div>
    `;
  }
}

loadGitHubRepos();
