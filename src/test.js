
"use strict";
new WOW().init();                    

let state = {
    ingredients: [],
    allergy: new Set(),
    diet: undefined
};

function renderIngredients(input) {
    let li = document.createElement("li");
    li.textContent = input;
    li.classList.add("list-group-item");
    let span = document.createElement("span");
    span.setAttribute("id", "delete-ingre");
    let img = document.createElement("img");
    img.src = "./img/deleteicon.png"
    span.appendChild(img);
    li.appendChild(span);

    

    return li;
}
function render(state) {
    let ul = document.querySelector("#ul-list");
    ul.textContent = "";
    for (let i = 0; i < state.ingredients.length; i++) {
        ul.appendChild(renderIngredients(state.ingredients[i]));
    }
}

render(state);

document.querySelector("#add-button")
    .addEventListener("click", function() {
        let ingreInput = document.querySelector("#input-ingre");
        let ingre = ingreInput.value;
        //let input = {ingre: ingre};
        state.ingredients.push(ingre);
        render(state);
        ingreInput.value = "";
        console.log(state.ingredients)
    });
/*
let deleteIngre = document.querySelector("#delete-ingre");
console.log(deleteIngre);
for (let i = 0; i < deleteIngre.length; i++) {
    console.log("hi")
    deleteIngre[i].addEventListener("click", function() {
        let ul = document.querySelector("#ul-list");
        ul.textContent = "";
        

    });
} */
document.querySelector("#beginquiz").addEventListener("click", function() {
    let ul = document.querySelector("#ul-list");
    ul.textContent = "";
    state.ingredients = [];
});

let allergyCheck = document.querySelectorAll("#allergy-input");
for (let i = 0; i < allergyCheck.length; i++) {
    allergyCheck[i].addEventListener("click", function(){
        let allergy = allergyCheck[i].value;
        //let checkedAllergy = {checkedAllergy: allergy}
        //let checked = allergyCheck[i].checked; // true
        //console.log(checked)
        if (allergyCheck[i].checked) {
            console.log(allergyCheck[i].checked)
            state.allergy.add(allergy);
            console.log(state.allergy)
        } else {
            console.log(allergyCheck[i].checked)
            state.allergy.delete(allergy);
            console.log(state.allergy)
        }
        console.log(Array.from(state.allergy));
        
        /*console.log(state.allergy)
        //boolean
        console.log(unchecked)
        /*if (unchecked === false) {
            state.allergy[i].remove(allergy);
        }*/
    });
}

let dietCheck = document.querySelectorAll("#diet-input");
for (let i = 0; i < dietCheck.length; i++) {
    dietCheck[i].addEventListener("click", function(){
        let diet = dietCheck[i].value;
        state.diet = diet;
        console.log(state.diet)
    });
}