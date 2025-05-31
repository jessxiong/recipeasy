// open & close popup form to create new cookbook
const cookbookPopup = document.getElementById('cookbookPopup');
document.getElementById('createCookbook').onclick = () => cookbookPopup.style.display = 'flex';
document.querySelector('.close-btn2').onclick = () => cookbookPopup.style.display = 'none';