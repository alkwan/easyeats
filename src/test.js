
"use strict";
new WOW().init();                    

let state = {
    ingredients: [],
    allergy: new Set(),
    diet: undefined
};
const ALLERGY_CHECK = document.querySelectorAll("#allergy-input");
const DIET_CHECK = document.querySelectorAll("#diet-input");

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
    
    //let allergyCheck = document.querySelectorAll("#allergy-input");
    for (let i = 0; i < ALLERGY_CHECK.length; i++) {
        ALLERGY_CHECK[i].checked = false;
    }
    state.allergy = new Set();
    console.log(state.allergy);
    for (let i = 0; i < DIET_CHECK.length; i++) {
        DIET_CHECK[i].checked = false;
    }
    state.diet = undefined;

});

let allergyCheck = document.querySelectorAll("#allergy-input");
for (let i = 0; i < ALLERGY_CHECK.length; i++) {
    ALLERGY_CHECK[i].addEventListener("click", function(){
        let allergy = ALLERGY_CHECK[i].value;
        //let checkedAllergy = {checkedAllergy: allergy}
        //let checked = allergyCheck[i].checked; // true
        //console.log(checked)
        if (ALLERGY_CHECK[i].checked) {
            state.allergy.add(allergy);
            console.log(state.allergy)
        } else {
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

for (let i = 0; i < DIET_CHECK.length; i++) {
    DIET_CHECK[i].addEventListener("click", function(){
        let diet = DIET_CHECK[i].value;
        state.diet = diet;
        console.log(state.diet)
    });
}


document.query