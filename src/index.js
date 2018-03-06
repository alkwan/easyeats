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

<<<<<<< HEAD

/////////////////////////////////////////////////////////////////////////////////////
// Get from API

const API_ID = "135ece56";
const API_KEY = "461b47c5925be6bbc2ec70ad608f7084";
const API_RECIPE_URL = "http://api.yummly.com/v1/api/recipes?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const META_ALLERGY = "http://api.yummly.com/v1/api/metadata/allergy?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const META_DIET = "http://api.yummly.com/v1/api/metadata/diet?_app_id=" + API_ID + "&_app_key=" + API_KEY;

/* KEEP THIS CHUNK FOR NOW!!!
let searchSpec = {
    q:["onion", "bread", "fish"], //&q=onion+bread+fish
    allergy: ["Dairy-Free", "Gluten-Free"], //meta data = http://api.yummly.com/v1/api/metadata/allergy?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
                        //format = &allowedAllergy[]=396^Dairy-Free&allowedAllergy[]=393^Gluten-Free
    diet: ["Pescetarian", "Lacto vegetarian"] //meta data = http://api.yummly.com/v1/api/metadata/diet?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
                        //format = &allowedDiet[]=390^Pescetarian&allowedDiet[]=388^Lacto vegetarian
} 
*/

let resultSearch = {
    ingredients: [],
    allergy: [],
    diet: [],
}

let metaData = {};

//Creates a URL endpoint for the API to grab data
function createSearchURL() {
    //Filter search
    // Add ingredients to the search url
    let search = "";
    let ingreds = resultSearch.ingredients;
    if (ingreds.length > 0) {
        search = "&q=";
        for (let i = 0; i < ingreds.length; i++) {
            if (i === 0) {
                search = search + ingreds[i];
            } else {
                search = search + "+" + ingreds[i];
            }
        }
=======
document.querySelector("#modal-submit").addEventListener("click", function() {
    if (searchSpec.ingredients.size >= 3) {
        //Dont let user submit button until at least 3 ingreds are put in!
        document.querySelector("#submit-link").setAttribute("href", "recipe.html?" + urlWrangling());
    } else {
        window.alert("needs at least 3 ingred!") //MAKE THIS PRETTIER
>>>>>>> 071994a26e0ed25d399fff382fa3216f0807023a
    }
});

function urlWrangling() {
    let allergyArr = Array.from(searchSpec.allergy);
    let ingredArr = Array.from(searchSpec.ingredients);
    let dietValue = searchSpec.diet;
    
<<<<<<< HEAD
    //Get diet data
    let restriction = "";
    let restrictResults = searchSpec.diet;
    //console.log(metaData.diet) UI needs Lacto-ovo vegetarian and Paleo, remove just vegetarian

    // if the user has a diet restriction, add it to the search url
    if (restrictResults && restrictResults !== "") {
        for (let i = 0; i < metaData.diet.length; i++) {
            if (metaData.diet[i].shortDescription === restrictResults) {
                restriction = "&allowedDiet[]=" + metaData.diet[i].id + "^" + restrictResults;
            }
        }
    }

    let endpoint = API_RECIPE_URL + search + allergySearch + restriction + "&maxResult=1000&maxTotalTimeInSeconds=1800";
    console.log(endpoint);
    return endpoint;
}

/**
 * Handles responses from the fetch() API.
 * @param {Response} response 
 */
function handleResponse(response) {
    if (response.ok) {
        let results = response.json();
        console.log(results);
        return results;
    } else {
        return response.json()
            .then(function(err) {
                throw new Error(err.errorMessage);
            });
=======
    let urlParams = new URLSearchParams(window.location.search);

    for (let i = 0; i < allergyArr.length; i++) {
        urlParams.append("allergy", allergyArr[i]);
>>>>>>> 071994a26e0ed25d399fff382fa3216f0807023a
    }
    for (let i = 0; i < ingredArr.length; i++) {
        urlParams.append("ingred", ingredArr[i]);
    }
    if (dietValue && dietValue !== "") {
        urlParams.append("diet", dietValue);
    }
<<<<<<< HEAD
}

// when you submit the quiz, fetch the data based off of the user's input
// after that, filter the results and show on the results page?
function onSubmitQuiz() {
    resultSearch.allergy = Array.from(searchSpec.allergy);
    resultSearch.ingredients = Array.from(searchSpec.ingredients);
    resultSearch.diet.push(searchSpec.diet);
    // before fetching, have the page display a loading screen

    //Handles Metadata URL codes
    fetch(META_ALLERGY)
        .then(parseMetaData)
        .then(rawJs => eval(rawJs))
        .catch(handleError);

    fetch(META_DIET)
        .then(parseMetaData)
        .then(rawJs => eval(rawJs))
        .catch(handleError);
        
    //Cannot get codes right away when calling API
    setTimeout(function() {
        getMetaCode("allergy", metaData.allergy, resultSearch.allergy);
        getMetaCode("diet", metaData.diet, resultSearch.diet);
        fetch(createSearchURL())
            .then(handleResponse)
            .then(filterResults)
            .then(renderResults)
            .then(changePage)
            .catch(handleError);    //Array results in PromiseValue.matches
    }, 1000);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
function changePage(cards) {
    window.location.href = "recipe.html";
    let section = document.querySelector(".container");
    section.appendChild(cards);
}

// Filter the data from the API
function filterResults(data) {
    let matches = data.matches;
    let recipes = [];

    for (let i = 0; i < matches.length; i++) {
        let numMatches = 0;
        let ingredients = matches[i].ingredients;
        for (let i = 0; i < ingredients.length; i++) {
            let ingredient = ingredients[i].toLowerCase();
            for (let j = 0; j < resultSearch.ingredients.length; j++) {
                if (ingredient.includes(resultSearch.ingredients[j])) {
                    numMatches++;
                }
            }
        }
        let percent = numMatches / resultSearch.ingredients.length;
        if (percent >= 0.5 && percent <= 1) {
            matches[i].percentMatch = percent;
            recipes.push(matches[i]);
        }
    }
    console.log(recipes);

    // sort the recipes by highest percent match
    recipes.sort(function(a, b) {
        return b.percentMatch - a.percentMatch;
    });
    
    let results = recipes.splice(0, 10);
    // now take this and display it on the screen... so return it???
    return results;
}

// create cards for each recipe, based on the results
function renderResults(results) {
    // once you click on one of these cards, fetch the recipe from the API
    let recipeDiv = document.createElement("div");
    console.log(results);
    for (let i = 0; i < results.length; i++) {
        let card = document.createElement("div");
        let name = results[i].recipeName;
        let id = results[i].id;
        let time = results[i].totalTimeInSeconds;
        let ingredients = results[i].ingredients;

        card.textContent = "Recipe Name: " + name + " Id: " + id + " Cook time: " + time + " Ingredients: " + ingredients;
        recipeDiv.appendChild(card);
    }
    return recipeDiv;
=======
    return urlParams.toString();
>>>>>>> 071994a26e0ed25d399fff382fa3216f0807023a
}