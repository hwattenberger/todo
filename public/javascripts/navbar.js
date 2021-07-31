const navHam = document.querySelector(".nav-ham")

navHam.addEventListener('click', (e) => {
    const loginDiv = document.querySelector(".login");
    const mainButtonDiv = document.querySelector(".div-main-buttons");

    console.log(loginDiv)

    if (loginDiv.style.display !== "flex") {
        loginDiv.style.display = "flex";
        mainButtonDiv.style.display = "flex";
    }
    else {
        loginDiv.style.display = "none";
        mainButtonDiv.style.display = "none";
    }
    // loginDiv.classList.toggle("show");
    // mainButtonDiv.classList.toggle("show");
})