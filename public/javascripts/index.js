async function init(){
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

async function loadRecipes(){
  document.getElementById("recipe-cards").innerText = "Loading...";
  let recipesJson = await fetchJSON(`api/recipes`)

  let recipesHtml = recipesJson.map(recipeInfo => {
    return `
    <div class="recipe-card">
    ${recipeInfo.recipePreview}
            </div> 
    `
  })
  document.getElementById("recipe-cards").innerHTML = recipesHtml;
}

async function postRecipe(){
  let recipeName = document.getElementById("recipeName").value;
  let recipeDescription = document.getElementById("recipeDescription").value;
  let recipeIngredients = document.getElementById("ingredientList").value;
  let recipeAllergens = document.getElementById("allegenList").value;
  let recipePrivacy = document.getElementById("recipePrivacy").value;
  let recipeImage = document.getElementById('coverPhoto').value;
  
  try{
        await fetchJSON(`api/${apiVersion}/recipes`, {
            method: "POST",
            body: {
              recipeName: recipeName,
              recipeDescription: recipeDescription,
              recipeIngredients: recipeIngredients,
              recipeAllergens: recipeAllergens,
              recipePrivacy: recipePrivacy,
              image: recipeImage
            }
        })
    }catch(error){
        document.getElementById("postStatus").innerText = "Error"
        throw(error)
    }

    loadRecipes();
}
