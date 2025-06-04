// open & close popup form to create new cookbook
const cookbookPopup = document.getElementById('cookbookPopup');
document.getElementById('createCookbook').onclick = () => cookbookPopup.style.display = 'flex';
document.querySelector('.close-btn2').onclick = () => cookbookPopup.style.display = 'none';

async function loadCookbooks() {
    const container = document.getElementById('cookbook-cards');
    container.innerText = 'Loading...';
  
    try {
      const cookbooks = await fetchJSON('/api/cookbook'); 
      function getCookbookIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
      }
    
    //Loads information about a specific cookbook
    async function loadCookbookInfo() {
        const cookbookId = getCookbookIdFromURL();
        if (!cookbookId) {
            document.getElementById("cookbook-title").innerText = "Cookbook not found";
            return;
        }
    
        try {
            const response = await fetch(`/api/cookbook`);
            const cookbook = await response.json();
            const cookbookOwnerId = cookbook.cookbookOwner
            const username = 
    
            document.getElementById("cookbook-title").innerText = cookbook.title
            document.getElementById("cookbook-description").innerText = cookbook.description || ""
            document.getElementById("cookbook-user").innerText = ""
            
  
    
        } catch (err) {
          document.getElementById("cookbook-title").innerText = "Error loading cookbook.";
          console.error(`Failed to load Cookbook ${err}`);
        }
      }
    
      loadCookbookInfo()
  
      if (!cookbooks.length) {
        container.innerText = 'No cookbooks found.';
        return;
      }
  
      container.innerHTML = cookbooks.map(cookbook => `
        <a href="cookbook.html?id=${encodeURIComponent(cookbook._id)}" class="cookbook-card">
          <h2>${cookbook.title || 'Untitled Cookbook'}</h2>
          <p>${cookbook.description || ''}</p>
          <p><em>Owner: ${cookbook.cookbookOwner || 'Unknown'}</em></p>
        </a>
      `).join('');
    }
    catch (error) {
      container.innerText = 'Failed to load cookbooks.';
      console.error('Error loading cookbooks:', error);
    }
  }

  async function postCookbook() {
  let cookbookTitle = document.getElementById("cookbookTitle").value;
  let cookbookDescription = document.getElementById("cookbookDescription").value;
  let cookbookPrivacy = document.getElementById("cookbookPrivacy").value;

  try {
    await fetchJSON(`api/cookbook`, {
      method: "POST",
      body: {
        cookbookTitle,
        cookbookDescription,
        cookbookPrivacy
      },
    });
    loadCookbooks();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

document.getElementById("cookbookForm").onsubmit = async (e) => {
  e.preventDefault();
  postCookbook();
};

  loadCookbooks()