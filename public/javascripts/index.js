
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
