//import {loadRecipes} from './index.js'
/*
retrieves the cookbook id from the URL
*/
function getCookbookIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

/*
Loads information about a specific cookbook
*/
async function loadCookbook() {
    const cookbookId = getCookbookIdFromURL();
    if (!cookbookId) {
      document.getElementById("cookbook-title").innerText = "Cookbook not found";
      return;
    }

    try {
      const response = await fetchJSON(`/api/cookbook/${cookbookId}`);
      const cookbook = await response.json();

      
      //document.getElementById("recipe-views").innerText = recipe.views || "0";
     document.getElementById("cookbook-title").innerText = cookbook.title
     document.getElementById("cookbook-desc").innerText = cookbook.description || ""
     document.getElementById("cookbook-user").innerText = cookbook.cookbookOwner
    if(cookbook.recipeIds?.length){
        //document.getElementById("cookbook-recipes").innerText = cookbook.recipeIds
        const recipes = await fetchCookbookRecipes(cookbook.recipeIds)
        //loadRecipes(recipes)
    }
    //redirects user to the recipes page if cookbook is empty
    else{ 
        document.getElementById("cookbook-recipes").innerText =   `<p>This cookbook is currently empty!! <a href="allRecipes.html">Find recipes to add</a>.</p>`
    }

    } catch (err) {
      document.getElementById("cookbook-title").innerText = "Error loading cookbook.";
      console.error(`Failed to load Cookbook ${err}`);
    }
  }

  async function fetchCookbookRecipes(recipeIds) {
    const response = await fetch("/api/recipes?ids=" + recipeIds.join(","));
    return await response.json();
  }