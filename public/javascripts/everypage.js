const flashDiv = document.querySelector('.flash')

if (flashDiv) {
    const flashX = document.querySelector('.flash i')

    flashX.addEventListener('click', (e) => {
        flashDiv.classList.add('notvisible');
    })
}

setupStyles();

function setupStyles() {
    if (typeof user !== 'undefined') {
        const style = user.defaultView
        document.documentElement.setAttribute('data-theme', style);
    }
}