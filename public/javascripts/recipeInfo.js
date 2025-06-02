function getRecipeIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  async function loadRecipe() {
    const recipeId = getRecipeIdFromURL();
    if (!recipeId) {
      document.getElementById("recipe-name").innerText = "Recipe not found";
      return;
    }

    try {
      const response = await fetch(`/api/recipes/${recipeId}`);
      const recipe = await response.json();

      document.getElementById("recipe-likes").innerText = recipe.likes || "0";
      document.getElementById("recipe-views").innerText = recipe.views || "0";

      document.getElementById("recipe-name").innerText = recipe.recipeName || "Untitled Recipe";
      document.getElementById("recipe-summary").innerText = recipe.recipeDescription || "No description available.";

      // Ingredients
      const ingredientsContainer = document.getElementById("ingredients-list");
      ingredientsContainer.innerHTML = recipe.recipeIngredients && recipe.recipeIngredients.length > 0
        ? recipe.recipeIngredients.map(ing => `<div>${ing}</div>`).join('')
        : "<div>No ingredients listed.</div>";

      // Allergens
      const allergensList = document.getElementById("recipe-allergens");
      allergensList.innerHTML = recipe.recipeAllergens && recipe.recipeAllergens.length > 0
        ? recipe.recipeAllergens.map(all => `<li>${all}</li>`).join('')
        : "<li>No allergens listed.</li>";

        await loadComments(recipeId);

    } catch (err) {
      document.getElementById("recipe-name").innerText = "Error loading recipe.";
      console.error("Failed to load recipe:", err);
    }
  }

  loadRecipe();

  async function loadComments(recipeId) {
  try {
    const response = await fetch(`/api/comments?recipeID=${recipeId}`);
    const comments = await response.json();

    const commentsContainer = document.querySelector(".comments-container");
    commentsContainer.innerHTML = "";

    if (!comments || comments.length === 0) {
      commentsContainer.innerHTML = "<p>No comments yet.</p>";
      return;
    }

    comments.forEach(comment => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");
      commentDiv.innerHTML = `
        <p><strong>${comment.username || "Anonymous"}:</strong></p>
        <p><strong>Rating:</strong> ${comment.rating}/5</p>
        <p>${comment.text}</p>
      `;
      commentsContainer.appendChild(commentDiv);
    });
  } catch (err) {
    console.error("Error loading comments:", err);
  }
}

document.getElementById("comment-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const recipeId = getRecipeIdFromURL();
  const text = document.getElementById("comment-text").value;
  const rating = parseInt(document.getElementById("comment-rating").value);
  const messageDiv = document.getElementById("comment-message");

  try {
    const res = await fetch(`/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ text, rating, recipeID: recipeId })
    });

    const data = await res.json();
    if (res.ok) {
      messageDiv.innerText = "Comment posted successfully!";
      document.getElementById("comment-form").reset();
      await loadComments(recipeId);
    } else {
      messageDiv.innerText = data.error || "Failed to post comment.";
    }
  } catch (err) {
    console.error("Error posting comment:", err);
    messageDiv.innerText = "Error posting comment.";
  }
});

loadRecipe();

