async function init(){
    await loadIdentity();
    loadUserInfo();
} 

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
     let newUsername = document.getElementById(`username-input`).value;
     let newAllergies = document.getElementById(`allergens-input`).value;
     let newDesc =  document.getElementById(`userDescritpion-input`).value;
     
     //update existing lists of allergens
    let existingUserInfo = await fetchJSON(`api/users?user=${encodeURIComponent(username)}`);
    let currentAllergens = existingUserInfo.allergens || [];
    let newAllergensList = newAllergies.split(',').map(a => a.trim());
    let combinedAllergens = Array.from(new Set([...currentAllergens, ...newAllergensList]));

     let responseJson = await fetchJSON(`api/users?user=${encodeURIComponent(username)}`, {
         method: "POST",
         body: {
             username: newUsername,
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
        document.getElementById(`username-display`).value = responseJson.username || username
        document.getElementById(`username-display`).innerHTML = responseJson.username ||username
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
*/
async function loadUserRecipes(username){
    document.getElementById("recipe-cards").innerText = "Loading...";
    let recipesJson = await fetchJSON(`api/recipes?username=${encodeURIComponent(username)}`);
  
}

 /*
loadUserCookbooks
    * function: gets json info of cookbooks belonging to username + displays on profile page
*/
async function loadUserCookbooks(username){
    document.getElementById("cookbook-cards").innerText = "Loading...";
    let cookbookJson = await fetchJSON(`api/cookbook?username=${encodeURIComponent(username)}`);
  
}
