async function init(){
  document.getElementById("recipeForm").onsubmit = (e) => {
    e.preventDefault();
    postRecipe();       
  };
  loadRecipes();
}

// open & close popup form to add new recipe
const popup = document.getElementById('recipePopup');
document.getElementById('addRecipe').onclick = () => popup.style.display = 'flex';
document.querySelector('.close-btn').onclick = () => popup.style.display = 'none';


// adding ingredients & allergens to recipe
function setupListInput({ inputId, addBtnId, listId, fieldId }) {
  const input = document.getElementById(inputId);
  const addBtn = document.getElementById(addBtnId);
  const list = document.getElementById(listId);
  const field = document.getElementById(fieldId);

  const values = [];

  function render() {
    list.innerHTML = '';
    values.forEach((val, idx) => {
      const li = document.createElement('li');
      li.textContent = val;

      const btn = document.createElement('button');
      btn.textContent = 'x';
      btn.type = 'button';
      btn.style.marginLeft = '10px';
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
      input.value = '';
      render();
    }
  };
}

// setup both inputs
setupListInput({
  inputId: 'ingredientInput',
  addBtnId: 'addIngredientBtn',
  listId: 'ingredientList',
  fieldId: 'ingredientsField'
});

setupListInput({
  inputId: 'allergenInput',
  addBtnId: 'addAllergenBtn',
  listId: 'allergenList',
  fieldId: 'allergensField'
});

// populate recipe cards in allRecipes from /recipes controller
async function loadRecipes() {
  document.getElementById("recipe-cards").innerText = "Loading...";
  let recipesJson = await fetchJSON(`api/recipes`);

  let recipesHtml = recipesJson.map(recipeInfo => {
    return `
    <a href="recipe.html?id=${recipeInfo._id}" class="recipe-card">
      <h2>${recipeInfo.recipeName || 'Untitled Recipe'}</h2>
      <img src="#" class="recipe-card-img"></img>
      <p class="description">${recipeInfo.recipeDescription || ''}</p>
      <div class="ingredients">
        <h4>Ingredients:</h4>
        <ul>
          ${recipeInfo.recipeIngredients ? 
            recipeInfo.recipeIngredients.map(ing => `<li>${ing}</li>`).join('') 
            : '<li>No ingredients listed</li>'}
        </ul>
      </div>
    </a>
    `;
  });
  
  document.getElementById("recipe-cards").innerHTML = recipesHtml.join('');
}

async function postRecipe(){
  let recipeName = document.getElementById("recipeName").value;
  let recipeDescription = document.getElementById("recipeDescription").value;
  let recipeIngredients = JSON.parse(document.getElementById("ingredientsField").value || "[]") 
  let recipeAllergens = JSON.parse(document.getElementById("allergensField").value || "[]");
  let recipePrivacy = document.getElementById("recipePrivacy").value;
  let recipeImage = document.getElementById('coverPhoto').value; // gives img file name for now, change later

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
        image: recipeImage
      }
    });
    document.getElementById("postStatus").innerText = "Recipe added!";
    document.getElementById("recipeForm").reset();
    popup.style.display = 'none';
    loadRecipes();
  } catch (error) {
    document.getElementById("postStatus").innerText = "Error";
    throw error;
  }
}


