document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  if (slides.length > 0) {
    showSlide(currentSlide);
    setInterval(nextSlide, 3000);
  }
});

const bakes = [
  { title: "Sourdough Bread", image: "images/sourdough.jpg" },
  { title: "Victoria Sponge", image: "images/victoriasponge.jpg" },
  { title: "Mini Egg Brownies", image: "images/minieggbrownies.jpg" },
  { title: "Cupcakes", image: "images/cupcakes.jpg" },
  { title: "Chocolate Chip Cookies", image: "images/cookies.jpg" }
];


const homeIngredientInput = document.getElementById("homeIngredientInput");
const homeSearchBtn = document.getElementById("homeSearchBtn");
const homeRecipeResults = document.getElementById("homeRecipeResults");

if (homeSearchBtn && homeIngredientInput && homeRecipeResults) {
  homeSearchBtn.addEventListener("click", searchHomeRecipes);

  homeIngredientInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      searchHomeRecipes();
    }
  });
}

async function searchHomeRecipes() {
  const ingredient = homeIngredientInput.value.trim();

  if (!ingredient) {
    homeRecipeResults.innerHTML = "<p>Please enter an ingredient.</p>";
    return;
  }

  homeRecipeResults.innerHTML = "<p>Loading recipes...</p>";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
    );

    const data = await response.json();

    if (!data.meals) {
      homeRecipeResults.innerHTML = "<p>No recipes found for that ingredient.</p>";
      return;
    }

    homeRecipeResults.innerHTML = data.meals
      .slice(0, 6)
      .map(
        (meal) => `
          <div class="home-recipe-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
          </div>
        `
      )
      .join("");
  } catch (error) {
    homeRecipeResults.innerHTML = "<p>Something went wrong. Please try again.</p>";
    console.error(error);
  }
}


function setBakeOfDay() {
  const image = document.getElementById("bakeImage");
  const title = document.getElementById("bakeTitle");

  if (!image || !title) return; // 🔥 prevents crash

  const today = new Date().getDate();
  const bake = bakes[today % bakes.length];

  title.textContent = bake.title;
  image.src = bake.image;
}

function setupRandomButton() {
  const btn = document.getElementById("randomBtn");

  if (!btn) return; // 🔥 prevents crash

  btn.addEventListener("click", () => {
    const random = bakes[Math.floor(Math.random() * bakes.length)];

    document.getElementById("bakeTitle").textContent = random.title;
    document.getElementById("bakeImage").src = random.image;
  });
}

setBakeOfDay();
setupRandomButton();




let activeCategory = "";
let searchTerm = "";

const threadList = document.getElementById("threadList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const postForm = document.getElementById("postForm");
const postTitle = document.getElementById("postTitle");
const postCategory = document.getElementById("postCategory");
const postContent = document.getElementById("postContent");
const featuredBtn = document.getElementById("featuredBtn");
const categoryCards = document.querySelectorAll(".category-card");

function categoryLabel(category) {
  switch (category) {
    case "cakes":
      return "Cakes & Cupcakes";
    case "cookies":
      return "Cookies & Biscuits";
    case "bread":
      return "Bread & Dough";
    case "help":
      return "Beginner Help";
    default:
      return "General";
  }
}

function renderThreads() {
  const filtered = threads.filter(thread => {
    const matchesCategory = activeCategory ? thread.category === activeCategory : true;
    const matchesSearch =
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  threadList.innerHTML = "";

  if (filtered.length === 0) {
    threadList.innerHTML = `
      <div class="empty-message">
        <p>No discussions matched your search yet.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((thread, index) => {
    const card = document.createElement("article");
    card.classList.add("thread-card");

    card.innerHTML = `
      <div class="thread-top">
        <h3 class="thread-title">${thread.title}</h3>
        <span class="thread-badge">${categoryLabel(thread.category)}</span>
      </div>
      <p class="thread-meta">By ${thread.author} • ${thread.time}</p>
      <p class="thread-text">${thread.content}</p>
      <div class="thread-actions">
        <button class="reply-btn" type="button">Reply</button>
        <button class="like-btn" type="button" data-index="${index}">❤ ${thread.likes}</button>
      </div>
    `;

    threadList.appendChild(card);
  });

  addLikeEvents();
  addReplyEvents();
}

function addLikeEvents() {
  const likeButtons = document.querySelectorAll(".like-btn");

  likeButtons.forEach(button => {
    button.addEventListener("click", () => {
      const visibleThreads = threads.filter(thread => {
        const matchesCategory = activeCategory ? thread.category === activeCategory : true;
        const matchesSearch =
          thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          thread.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      const title = button.closest(".thread-card").querySelector(".thread-title").textContent;
      const originalThread = threads.find(thread => thread.title === title);

      if (originalThread) {
        originalThread.likes += 1;
        renderThreads();
      }
    });
  });
}

function addReplyEvents() {
  const replyButtons = document.querySelectorAll(".reply-btn");

  replyButtons.forEach(button => {
    button.addEventListener("click", () => {
      alert("Reply feature coming soon 🍰");
    });
  });
}

/*------------------------------------search---------------------------------*/
async function searchHomeRecipes() {
  const ingredient = homeIngredientInput.value.trim();

  if (!ingredient) {
    homeRecipeResults.innerHTML = "<p>Please enter an ingredient.</p>";
    return;
  }

  homeRecipeResults.innerHTML = "<p>Loading baking recipes...</p>";

  try {
    // Step 1: get meals by ingredient
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
    );
    const data = await response.json();

    if (!data.meals) {
      homeRecipeResults.innerHTML = "<p>No recipes found for that ingredient.</p>";
      return;
    }

    // Step 2: get full details for each meal and keep only desserts
    const detailedMeals = await Promise.all(
      data.meals.slice(0, 12).map(async (meal) => {
        const detailResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        );
        const detailData = await detailResponse.json();
        return detailData.meals[0];
      })
    );

    const bakingMeals = detailedMeals.filter(
      (meal) => meal.strCategory === "Dessert"
    );

    if (bakingMeals.length === 0) {
      homeRecipeResults.innerHTML =
        "<p>No baking recipes found for that ingredient. Try chocolate, cream, butter, apple, or cinnamon.</p>";
      return;
    }

    homeRecipeResults.innerHTML = bakingMeals
      .slice(0, 6)
      .map(
        (meal) => `
          <div class="home-recipe-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p>${meal.strCategory}</p>
          </div>
        `
      )
      .join("");
  } catch (error) {
    homeRecipeResults.innerHTML =
      "<p>Something went wrong. Please try again.</p>";
    console.error(error);
  }
}

if (postForm && postTitle && postCategory && postContent) {
  postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newTitle = postTitle.value.trim();
    const newCategory = postCategory.value;
    const newContent = postContent.value.trim();

    if (!newTitle || !newCategory || !newContent) {
      return;
    }

    threads.unshift({
      title: newTitle,
      category: newCategory,
      author: "You",
      time: "Just now",
      content: newContent,
      likes: 0
    });

    postForm.reset();
    activeCategory = "";
    searchTerm = "";

    if (searchInput) {
      searchInput.value = "";
    }

    categoryCards.forEach(c => c.classList.remove("selected-category"));

    if (threadList) {
      renderThreads();
    }
  });
}

if (featuredBtn && postTitle && postCategory && postContent) {
  featuredBtn.addEventListener("click", () => {
    postTitle.value = "What’s one baking mistake that taught you the most?";
    postCategory.value = "help";
    postContent.value = "I’d love to hear what baking mistakes helped you improve the most.";
    postTitle.focus();
  });
}

if (threadList) {
  renderThreads();
}


document.querySelectorAll(".toggle-btn").forEach(button => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;

    if (details.style.display === "block") {
      details.style.display = "none";
      button.textContent = "Show Ingredients & Steps";
    } else {
      details.style.display = "block";
      button.textContent = "Hide Ingredients & Steps";
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const forumForm = document.getElementById("forumForm");
  const postsContainer = document.getElementById("posts");

  if (!forumForm || !postsContainer) return;

  let savedPosts = JSON.parse(localStorage.getItem("forumPosts")) || [];

  function renderPosts() {
    postsContainer.innerHTML = "<h2>Recent Discussions</h2>";

    if (savedPosts.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No discussions yet. Start the first one!";
      postsContainer.appendChild(emptyMessage);
      return;
    }

    savedPosts.forEach((post) => {
      const article = document.createElement("article");
      article.classList.add("forum-post");

      article.innerHTML = `
        <h3>${post.title}</h3>
        <p class="post-meta">Posted by ${post.name}</p>
        <p>${post.message}</p>
      `;

      postsContainer.appendChild(article);
    });
  }

  forumForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const title = document.getElementById("title").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !title || !message) {
      alert("Please fill in everything!");
      return;
    }

    const newPost = { name, title, message };

    savedPosts.unshift(newPost);
    localStorage.setItem("forumPosts", JSON.stringify(savedPosts));

    forumForm.reset();
    renderPosts();
  });

  renderPosts();
});


/*CONTACT FORM*/
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2) {
      formMessage.textContent = "Please enter a valid name.";
      formMessage.style.color = "#8E1913";
      return;
    }

    if (!emailPattern.test(email)) {
      formMessage.textContent = "Please enter a valid email address.";
      formMessage.style.color = "#8E1913";
      return;
    }

    if (subject.length < 3) {
      formMessage.textContent = "Please enter a subject.";
      formMessage.style.color = "#8E1913";
      return;
    }

    if (message.length < 10) {
      formMessage.textContent = "Your message must be at least 10 characters long.";
      formMessage.style.color = "#8E1913";
      return;
    }

    formMessage.textContent = "Message sent successfully!";
    formMessage.style.color = "green";

    contactForm.reset();
  });
}






