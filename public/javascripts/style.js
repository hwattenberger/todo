const styleSelection = document.querySelector('select')
const showCompleted = document.querySelector("#showCompleted");

styleSelection.addEventListener('change', (e) => {
    console.log(styleSelection.value);
    document.documentElement.setAttribute('data-theme', styleSelection.value);

    axios.put(`/setup?theme=${styleSelection.value}`)
        .then( res => {
            console.log("Success", res)})
        .catch( err => {
            console.log("Error", err)})
});

showCompleted.addEventListener('click', (e) => {
    console.log("Test", e.currentTarget.checked)
    let toggled = "";

    if(e.currentTarget.checked) toggled=0
    else  toggled=1

    axios.put(`/setup?public=${toggled}`)
        .then( res => {
            console.log("Success", res)})
        .catch( err => {
            console.log("Error", err)})
})
