async function init(){
    loadUserInfo();
} 

/*
open & close popup form to update user info
*/
const userPopup = document.getElementById('userPopup');
document.getElementById('updateUserInfo').onclick = () => userPopup.style.display = 'flex';
document.querySelector('.close-btn').onclick = () => userPopup.style.display = 'none';


/*
saveUserInfo
    * function: takes user input and saves/updates info to corresponding User Object
    * json of user info
*/
async function saveUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
     const username = urlParams.get('user');
     if(username==myIdentity){
         document.getElementById("username-span").innerText= `You (${username})`;
         document.getElementById("user_info_new_div").classList.remove("d-none");
         
     }else{
         document.getElementById("username-span").innerText=username;
         document.getElementById("user_info_new_div").classList.add("d-none");
     } 
     // gets user inputs 
     let newAllergies = document.getElementById(`allergens-input`).value;
     let newDesc =  document.getElementById(`userDescription-input`).value;
     
     //update existing lists of allergens
    let existingUserInfo = await fetchJSON(`api/users?user=${encodeURIComponent(username)}`);
    let currentAllergens = existingUserInfo.allergens || [];
    let newAllergensList = newAllergies.split(',').map(a => a.trim());
    let combinedAllergens = Array.from(new Set([...currentAllergens, ...newAllergensList]));

     let responseJson = await fetchJSON(`api/users?user=${encodeURIComponent(username)}`, {
         method: "POST",
         body: {
             username: username,
             userDescription: newDesc,
             allergens: combinedAllergens
         }
     })
     console.log(`Response from saveUserInfo: ${responseJson}`)
     loadUserInfo();
 }

 /*
loadUserInfo
    * function: loads User Info to be displayed on profile page
    * Errors: 
            * fetching userInfo in json format
            * any error in the client side code
*/
 async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user-info-new-div").classList.add("d-none");
    }
    try{
        let responseJson = await fetchJSON(`api/users?user=${encodeURIComponent(username)}`)
        if(!responseJson.ok){ 
            console.log("error fetching and loading userInfo json")
        }
        
        document.getElementById(`userDescription-display`).value = responseJson.userDescription || ""
        document.getElementById(`userDescription-display`).innerHTML = responseJson.userDescription || ""
        document.getElementById(`allergens-display`).value = responseJson.allergens || ""
        document.getElementById(`allergens-display`).innerHTML = responseJson.allergens || ""

    }catch(error){
        console.log(`client side error using loadUserInfo(): ${error}`)
    }

    loadUserCookbooks(username)
    loadUserRecipes(username)
}

 /*
loadUserRecipes
    * function: gets json info of recipes given username has posted + displays on profile page
    * error: displays errors loading + retrieving recipe info
*/
async function loadUserRecipes(username){
    try{
        document.getElementById("recipe-cards").innerText = "Loading...";
        let recipesJson = await fetchJSON(`api/recipes?username=${encodeURIComponent(username)}`);
        let recipesHTML = recipesJson.map((recipeInfo) => {
            return `
            <h1>${username}'s Recipes:</h1>
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

        document.getElementById("recipe-cards").innerHTML = recipesHTML;
    }
    catch (error) {
        container.innerText = `Failed to load recipes for ${username}`
        console.error(`Error loading cookbooks for ${username}: `, error);
  }
}

 /*
loadUserCookbooks
    * function: gets json info of cookbooks belonging to username + displays on profile page
    * Errors: 
*/
async function loadUserCookbooks(username){
    try{
        document.getElementById("cookbook-cards").innerText = "Loading...";
        let cookbookJson = await fetchJSON(`api/cookbook?username=${encodeURIComponent(username)}`);
        container.innerHTML =  cookbookJson.map(cookbook => `
            <h1>${username}'s Cookbooks:</h1>
            <a href="cookbook.html?id=${encodeURIComponent(cookbook._id)}" class="cookbook-card">
            <h2>${cookbook.title || 'Untitled Cookbook'}</h2>
            <p>${cookbook.description || ''}</p>
            <p><em>Owner: ${cookbook.cookbookOwner || 'Unknown'}</em></p>
            </a>
        `).join('');
    }
    catch (error) {
        container.innerText = `Failed to load cookbooks for ${username}`
        console.error(`Error loading cookbooks for ${username}: `, error);
  }
}

document.getElementById("userForm").onsubmit = async (e) => {
    e.preventDefault();
    await saveUserInfo();
    userPopup.style.display = 'none';
  };
