
// open & close popup form to add new recipe
const popup = document.getElementById('recipePopup');
const openBtn = document.getElementById('addRecipe');
const closeBtn = document.querySelector('.close-btn');

openBtn.onclick = () => {
    popup.style.display = 'flex';
};

closeBtn.onclick = () => {
    popup.style.display = 'none';
};


// adding ingredients to recipe
const ingredientInput = document.getElementById('ingredientInput');
const addIngredientBtn = document.getElementById('addIngredientBtn');
const ingredientList = document.getElementById('ingredientList');
const ingredientsField = document.getElementById('ingredientsField');
const recipeForm = document.getElementById('recipeForm');

let ingredients = [];

addIngredientBtn.onclick = () => {
  const value = ingredientInput.value.trim();
  if (value) {
    ingredients.push(value);
    ingredientInput.value = '';
    renderIngredients();
  }
};

function renderIngredients() {
  ingredientList.innerHTML = '';
  ingredients.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'x';
    removeBtn.style.marginLeft = '10px';
    removeBtn.type = 'button';
    removeBtn.onclick = () => {
      ingredients.splice(index, 1);
      renderIngredients();
    };

    li.appendChild(removeBtn);
    ingredientList.appendChild(li);
  });

  // Update hidden input field with JSON or comma-separated list
  ingredientsField.value = JSON.stringify(ingredients); // or use `.join(', ')`
}
