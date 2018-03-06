//Gets all the user input about the recipe they are looking for

"use strict";

let searchSpec = {
    //ingredients: [],
    ingredients: new Set(),
    currentIngre: "",
    allergy: new Set(),
    diet: ""
};

const ALLERGY_CHECK = document.querySelectorAll("#allergy-input");
const DIET_CHECK = document.querySelectorAll("#diet-input");

let ingreID = 0;
function renderIngredients(input) {
    let li = document.createElement("li");
    li.textContent = input;
    li.classList.add("list-group-item");
    li.setAttribute("id", "ingre"+ ingreID);
    
    let span = document.createElement("span");
    span.setAttribute("onClick",'deleteIngre("'+'ingre'+ingreID+'")');

    let img = document.createElement("img");
    img.src = "./img/deleteicon.png"
    span.appendChild(img);
    li.appendChild(span);
    ingreID+=1;
    return li;
}

function render(searchSpec) {
    let ul = document.querySelector("#ul-list");
    ul.textContent = "";
    //ul.appendChild(renderIngredients(searchSpec.currentIngre))
    for (let item of searchSpec.ingredients) ul.appendChild(renderIngredients(item));
    /*for (let i = 0; i < searchSpec.ingredients.length; i++) {
        ul.appendChild(renderIngredients(searchSpec.ingredients[i]));
    }*/
}

render(searchSpec);

// Keep track of input ingredients
document.querySelector("#add-button")
    .addEventListener("click", function() {
        let ingreInput = document.querySelector("#input-ingre");
        let ingre = ingreInput.value;
        searchSpec.ingredients.add(ingre);
        searchSpec.currentIngre = ingre;
        render(searchSpec);
        ingreInput.value = "";
    });

function deleteIngre(ingreid) {
    let ingre = document.getElementById(ingreid);
    console.log(ingre);
    let ul = document.querySelector("#ul-list");
    ul.removeChild(ingre);
    searchSpec.ingredients.delete(ingre.textContent);
    console.log(searchSpec.ingredients);
}   

// Start search all over again
document.querySelector("#beginquiz").addEventListener("click", function() {
    let ul = document.querySelector("#ul-list");
    ul.textContent = "";
    searchSpec.ingredients = new Set();
    for (let i = 0; i < ALLERGY_CHECK.length; i++) {
        ALLERGY_CHECK[i].checked = false;
    }
    searchSpec.allergy = new Set();
    for (let i = 0; i < DIET_CHECK.length; i++) {
        DIET_CHECK[i].checked = false;
    }
    searchSpec.diet = undefined;
});

// Keep track of checked allergy
for (let i = 0; i < ALLERGY_CHECK.length; i++) {
    ALLERGY_CHECK[i].addEventListener("click", function(){
        let allergy = ALLERGY_CHECK[i].value;
        if (ALLERGY_CHECK[i].checked) {
            searchSpec.allergy.add(allergy);
        } else {
            searchSpec.allergy.delete(allergy);
        }
    });
}

// Keep track of checked diet
for (let i = 0; i < DIET_CHECK.length; i++) {
    DIET_CHECK[i].addEventListener("click", function(){
        let diet = DIET_CHECK[i].value;
        searchSpec.diet = diet;
    });
}

document.querySelector("#modal-submit").addEventListener("click", function() {
    if (searchSpec.ingredients.size >= 3) {
        //Dont let user submit button until at least 3 ingreds are put in!
        document.querySelector("#submit-link").setAttribute("href", "recipe.html?" + urlWrangling());
    } else {
        window.alert("needs at least 3 ingred!") //MAKE THIS PRETTIER
    }
});

function urlWrangling() {
    let allergyArr = Array.from(searchSpec.allergy);
    let ingredArr = Array.from(searchSpec.ingredients);
    let dietValue = searchSpec.diet;
    
    let urlParams = new URLSearchParams(window.location.search);

    for (let i = 0; i < allergyArr.length; i++) {
        urlParams.append("allergy", allergyArr[i]);
    }
    for (let i = 0; i < ingredArr.length; i++) {
        urlParams.append("ingred", ingredArr[i]);
    }
    if (dietValue && dietValue !== "") {
        urlParams.append("diet", dietValue);
    }
    return urlParams.toString();
}