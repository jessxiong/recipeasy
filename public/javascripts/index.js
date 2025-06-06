async function init() {
  await updateAuthUI();
  document.getElementById("recipeForm").onsubmit = (e) => {
    e.preventDefault();
    postRecipe();
  };
  loadRecipes();
}

// open & close popup form to add new recipe
const popup = document.getElementById("recipePopup");
document.getElementById("addRecipe").onclick = () =>
  (popup.style.display = "flex");
document.querySelector(".close-btn").onclick = () =>
  (popup.style.display = "none");

// adding ingredients & allergens to recipe
function setupListInput({ inputId, addBtnId, listId, fieldId }) {
  const input = document.getElementById(inputId);
  const addBtn = document.getElementById(addBtnId);
  const list = document.getElementById(listId);
  const field = document.getElementById(fieldId);

  const values = [];

  function render() {
    list.innerHTML = "";
    values.forEach((val, idx) => {
      const li = document.createElement("li");
      li.textContent = val;

      const btn = document.createElement("button");
      btn.textContent = "x";
      btn.type = "button";
      btn.style.marginLeft = "10px";
      btn.onclick = () => {
        values.splice(idx, 1);
        render();
      };

      li.appendChild(btn);
      list.appendChild(li);
    });
    field.value = JSON.stringify(values);
  }

  addBtn.onclick = () => {
    const val = input.value.trim();
    if (val) {
      values.push(val);
      input.value = "";
      render();
    }
  };
}

// setup both inputs
setupListInput({
  inputId: "ingredientInput",
  addBtnId: "addIngredientBtn",
  listId: "ingredientList",
  fieldId: "ingredientsField",
});

setupListInput({
  inputId: "allergenInput",
  addBtnId: "addAllergenBtn",
  listId: "allergenList",
  fieldId: "allergensField",
});

// populate recipe cards in allRecipes from /recipes controller
async function loadRecipes(filters = {}) {
  document.getElementById("recipe-cards").innerText = "Loading...";

  // search and filter logic
  let url = "api/recipes";
  let query = [];

  // search

  // filters
  if (filters.ingredients && filters.ingredients.length) {
    filters.ingredients.forEach((ingredient) => {
      query.push("ingredients=" + encodeURIComponent(ingredient));
    });
  }
 if (filters.allergens && filters.allergens.length) {
    filters.allergens.forEach((allergen) => {
      query.push("allergens=" + encodeURIComponent(allergen));
    });
  }
  if (filters.privacy) {
    query.push("privacy=" + encodeURIComponent(filters.privacy));
  }

  if (filters.searchQuery) {
    query.push("searchQuery=" + encodeURIComponent(filters.searchQuery));
  }

  if (filters.recipeIds && filters.recipeIds.length) {
    filters.recipeIds.forEach(id => {
      query.push("recipeIds=" + encodeURIComponent(id));
    });
  }

  if (query.length) {
    url += "?" + query.join("&");
  }

  let recipesJson = await fetchJSON(url);

  let recipesHtml = recipesJson.map((recipeInfo) => {
    const isPrivate = recipeInfo.recipePrivacy === "private";
    return `
    <a href="recipe.html?id=${recipeInfo._id}" class="recipe-card">
      <h2>${recipeInfo.recipeName || "Untitled Recipe"}</h2>
      <p class="owner">${recipeInfo.recipeOwner || ""}</p>
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
      ${isPrivate ? `<span class="lock-icon" title="Private">&#128274;</span>` : ""}
    </a>
    `;
  });
  document.getElementById("recipe-cards").innerHTML = recipesHtml.join("");
}

async function postRecipe() {
  let recipeName = document.getElementById("recipeName").value;
  let recipeDescription = document.getElementById("recipeDescription").value;
  let recipeIngredients = JSON.parse(
    document.getElementById("ingredientsField").value || "[]"
  );
  let recipeAllergens = JSON.parse(
    document.getElementById("allergensField").value || "[]"
  );
  let recipePrivacy = document.getElementById("recipePrivacy").value.toLowerCase();
  let recipeInstructions = document.getElementById("recipeInstructions").value;

  if (!recipeName.trim()) {
    document.getElementById("postStatus").innerText = "Recipe name is required";
    return;
  }

  try {
    await fetchJSON(`api/recipes`, {
      method: "POST",
      body: {
        recipeName,
        recipeDescription,
        recipeIngredients,
        recipeAllergens,
        recipePrivacy,
        recipeInstructions
      },
    });
    document.getElementById("postStatus").innerText = "Recipe added!";
    document.getElementById("recipeForm").reset();
    popup.style.display = "none";
    loadRecipes();
  } catch (error) {
    document.getElementById("postStatus").innerText = "Error";
    throw error;
  }
}

// getting filter terms
function getCurrentFilters() {
  const ingredients = Array.from(
    document.querySelectorAll('input[name="ingredients"]:checked')
  ).map((input) => input.value);

  const allergens = Array.from(
    document.querySelectorAll('input[name="allergens"]:checked')
  ).map((input) => input.value);

  const privacy = document.querySelector('input[name="privacy"]:checked').value.toLowerCase();

  const searchQuery = document.getElementById("searchQuery").value.trim();

  return { ingredients, allergens, privacy, searchQuery };
}

// Filter form submit
document.getElementById("filterForm").onsubmit = async (e) => {
  e.preventDefault();
  loadRecipes(getCurrentFilters());
};

// Search input change
document.getElementById("searchQuery").oninput = async (e) => {
  loadRecipes(getCurrentFilters());
};

//dynamic sign in and sign out button based on authentication status
async function updateAuthUI() {
  try {
    const res = await fetch('/api/session');
    if (!res.ok) throw new Error('Not authenticated');

    const data = await res.json();

    if (data.isAuthenticated) {
      document.getElementById("signInLink").style.display = "none";
      document.getElementById("signOutLink").style.display = "inline";
    } else {
      document.getElementById("signInLink").style.display = "inline";
      document.getElementById("signOutLink").style.display = "none";
    }
  } catch (err) {
    document.getElementById("signInLink").style.display = "inline";
    document.getElementById("signOutLink").style.display = "none";
  }
}
