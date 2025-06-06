function getCookbookIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function postCookbookRecipe() {
  let cookbookTitle = document.getElementById("cookbookTitle").value;
  let cookbookDescription = document.getElementById(
    "cookbookDescription"
  ).value;
  let cookbookPrivacy = document.getElementById("cookbookPrivacy").value;

  try {
    await fetchJSON(`api/cookbook`, {
      method: "POST",
      body: {
        cookbookId,
        recipeId,
      },
    });
    loadCookbookRecipes();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Loads recipes in a specific cookbook
async function loadCookbookRecipes(cookbookRecipes) {
  try {
    const recipePromises = cookbookRecipes.map((recipeId) =>
      fetchJSON(`/api/recipes/${recipeId}`)
    );

    const recipes = await Promise.all(recipePromises);
    console.log("loadcbrecipe recipes", recipes);

    let cookbookRecipesHtml = recipes.map((recipeInfo) => {
      return `
    <a href="recipe.html?id=${recipeInfo._id}" class="recipe-card">
      <h2>${recipeInfo.recipeName || "Untitled Recipe"}</h2>
      <p class="description">${recipeInfo.recipeDescription || ""}</p>
      <div class="ingredients">
        <h4>Ingredients:</h4>
        <ul>
          ${
            recipeInfo.recipeIngredients
              ? recipeInfo.recipeIngredients
                  .map((ing) => `<li>${ing}</li>`)
                  .join("")
              : "<li>No ingredients listed</li>"
          }
        </ul>
      </div>
    </a>
    `;
    });

    document.getElementById("recipe-cards").innerHTML = cookbookRecipesHtml;
  } catch (err) {
    console.error("Error loading recipes", err);
  }
}

document.getElementById("add-recipe-form").onsubmit = async (e) => {
  e.preventDefault();
  postCookbookRecipe();
};

//Loads information about a specific cookbook
async function loadCookbookInfo() {
  const cookbookId = getCookbookIdFromURL();

  if (!cookbookId) {
    console.error("Cookbook not found in db");
    return;
  }

  try {
    const response = await fetch(
      `/api/cookbook/${encodeURIComponent(cookbookId)}`
    );
    if (!response.ok) {
      console.log(`issue getting cookbook id in`);
    }
    const cookbook = await response.json();
    console.log("load cookbook info", cookbook);

    document.getElementById("cookbook-title").innerText = cookbook.title;
    document.getElementById("cookbook-description").innerText =
      cookbook.description || "";
    document.getElementById("cookbook-user").innerText = cookbook.cookbookOwner;

    const recipeIds = cookbook.cookbookRecipes;

    if (recipeIds.length > 0) {
      loadCookbookRecipes(cookbook.cookbookRecipes);
    } else {
      document.getElementById(
        "recipe-cards"
      ).innerHTML = `<p>This cookbook is currently empty! <a href="allRecipes.html">Find recipes here!</a>.</p>`;
    }
  } catch (err) {
    document.getElementById("cookbook-title").innerText =
      "Error loading cookbook.";
    console.error(`Failed to load Cookbook ${err}`);
  }
}

loadCookbookInfo();

// Displays form to select which recipes to add to cookbook
document.getElementById("addRecipetoBook").onclick = async () => {
  const popup = document.getElementById("add-recipe-popup");
  const optionsContainer = document.getElementById("recipe-options");

  popup.style.display = "flex";
  optionsContainer.innerHTML = "Loading...";

  try {
    const allRecipes = await fetchJSON("/api/recipes");
    optionsContainer.innerHTML = allRecipes
      .map(
        (r) =>
          `<label><input type="checkbox" name="recipeId" value="${r._id}"> ${r.recipeName}</label>`
      )
      .join("");
  } catch (err) {
    optionsContainer.innerHTML = "<p>Error loading recipes</p>";
    console.error(err);
  }
};

document.querySelector(".close-btn").onclick = () => {
  document.getElementById("add-recipe-popup").style.display = "none";
};

// adds recipes to cookbook schema
document.getElementById("add-recipe-form").onsubmit = async (e) => {
  e.preventDefault();

<<<<<<< HEAD
        document.getElementById("add-recipe-popup").style.display = "none";
        location.reload();
    } catch (err) {
      console.error("Error adding recipe to cookbook:", err);
      alert("Failed to add recipe: " + err.message);
=======
  const selectedIds = Array.from(
    document.querySelectorAll('input[name="recipeId"]:checked')
  ).map((cb) => cb.value);

  const cookbookId = new URLSearchParams(window.location.search).get("id");

  if (!cookbookId || selectedIds.length === 0) return;

  try {
    for (let recipeId of selectedIds) {
      const response = await fetch(`/api/cookbook/addRecipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cookbookId,
          recipeId,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
>>>>>>> e85df7ac72834f2f2ee646aa30e46ebbaadba44f
    }

    document.getElementById("add-recipe-popup").style.display = "none";
    location.reload();
  } catch (err) {
    console.error("Error adding recipe to cookbook:", err);
  }
};
