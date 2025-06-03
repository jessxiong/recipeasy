function getCookbookIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }
  
//Loads information about a specific cookbook
async function loadCookbookInfo() {
   const cookbookId = getCookbookIdFromURL()

    if (!cookbookId) {
        console.error( "Cookbook not found in db")
        return;
    }

    try {
        const response = await fetch(`/api/cookbook/${cookbookId}`);
        if(!response.ok){
            console.log(`issue getting cookbook id in`)
        }
        const cookbook = await response.json();
        console.log(cookbook);

        document.getElementById("cookbook-title").innerText = cookbook.title
        document.getElementById("cookbook-description").innerText = cookbook.description || ""
        // document.getElementById("cookbook-user").innerText = cookbook.cookbookOwner
        
        if(cookbook.recipeIds?.length){
            loadRecipes({ recipeIds: cookbook.recipeIds })
        } 
        else{ //redirects user to the recipes page if cookbook is empty
            document.getElementById("recipe-cards").innerHTML =  `<p>This cookbook is currently empty!! <a href="allRecipes.html">Find recipes here!</a>.</p>`
        }

    } catch (err) {
      document.getElementById("cookbook-title").innerText = "Error loading cookbook.";
      console.error(`Failed to load Cookbook ${err}`);
    }
  }

  loadCookbookInfo()