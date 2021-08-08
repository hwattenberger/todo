const navHam = document.querySelector(".nav-ham")

navHam.addEventListener('click', (e) => {
    const loginDiv = document.querySelector(".login");
    const mainButtonDiv = document.querySelector(".div-main-buttons");

    loginDiv.classList.toggle('active')
    mainButtonDiv.classList.toggle('active')

})