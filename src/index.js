"use strict";
//new WOW().init();                    

let searchSpec = {
    ingredients: new Set(),
    currentIngre: "",
    allergy: new Set(),
    diet: undefined
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
    for (let item of searchSpec.ingredients) ul.appendChild(renderIngredients(item));
    console.log(searchSpec.ingredients)
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
        console.log(searchSpec.ingredients)
    });

// Remove specific ingredient
function deleteIngre(ingreid) {
    let ingre = document.getElementById(ingreid);
    let ul = document.querySelector("#ul-list");
    ul.removeChild(ingre);
    searchSpec.ingredients.delete(ingre.textContent);
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


/////////////////////////////////////////////////////////////////////////////////////
// Get from API

const API_ID = "135ece56";
const API_KEY = "461b47c5925be6bbc2ec70ad608f7084";
const API_RECIPE_URL = "http://api.yummly.com/v1/api/recipes?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const META_ALLERGY = "http://api.yummly.com/v1/api/metadata/allergy?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const META_DIET = "http://api.yummly.com/v1/api/metadata/diet?_app_id=" + API_ID + "&_app_key=" + API_KEY;

/*
let searchSpec = {
    q:["onion", "bread", "fish"], //&q=onion+bread+fish
    allergy: ["Dairy-Free", "Gluten-Free"], //meta data = http://api.yummly.com/v1/api/metadata/allergy?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
                        //format = &allowedAllergy[]=396^Dairy-Free&allowedAllergy[]=393^Gluten-Free
    diet: ["Pescetarian", "Lacto vegetarian"] //meta data = http://api.yummly.com/v1/api/metadata/diet?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
                        //format = &allowedDiet[]=390^Pescetarian&allowedDiet[]=388^Lacto vegetarian
} 
*/


let resultCodes = {
    allergy: [],
    diet: []
}

let metaData = {};

let dietArr = [];
dietArr.push(searchSpec.diet);
searchSpec.diet = dietArr;


function createSearchURL() {
    //Filter search
    let search = "";
    let ingreds = searchSpec.q;
    if (ingreds && ingreds !== "") {
        search = "&q=";
        for (let i = 0; i < ingreds.length; i++) {
            if (i === 0) {
                search = search + ingreds[i];
            } else {
                search = search + "+" + ingreds[i];
            }
        }
    }

    //Get allergy data
    let allergySearch = "";
    let allergies = Array.from(searchSpec.allergy);
    if (allergies.length > 0) {       
        for (let i = 0; i < allergies.length; i++) {
            allergySearch = allergySearch + "&allowedAllergy[]=" + resultCodes.allergy[i] + "^" + allergies[i];
            console.log(allergySearch);
        }
    }

    //Get restriction data
    let restriction = "";
    let restrictResults = searchSpec.diet;
    if (restrictResults.length > 0) {
        for (let i = 0; i < restrictResults.length; i++) {
            restriction = restriction + "&allowedDiet[]=" + resultCodes.diet[i] + "^" + restrictResults[i];
        }
    }
    let endpoint = API_RECIPE_URL + search + allergySearch + restriction;
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
    }
}

function parseMetaData(response) {
    if (response.ok) {
        return response.text();
    } else {
        return response.json()
            .then(function(err) {
                throw new Error(err.errorMessage);
            });
    }
}

/**
 * Handles errors that occur while fetching
 * @param {Error} err 
 */
function handleError(err) {
    console.error(err.message);
}

//Yummly API is silly and returns JSONP instead of JSON
function set_metadata(key, value) {
    metaData[key] = value;
}

function getMetaCode(type, codes, resultArr) {
    for (let i = 0; i < resultArr.length; i++) {
        for (let j = 0; j < codes.length; j++) {
            if (resultArr[i] === codes[j].shortDescription) {
                if (type === "allergy") {
                    resultCodes.allergy.push(codes[j].id);
                } else if (type === "diet") {
                    resultCodes.diet.push(codes[j].id);
                }
            }
        }
    }
}


function onSubmitQuiz() {
    //Handles Metadata URL codes
    console.log("entered")
    console.log(searchSpec)
    
    
    fetch(META_ALLERGY)
        .then(parseMetaData)
        .then(rawJs => eval(rawJs));

    fetch(META_DIET)
        .then(parseMetaData)
        .then(rawJs => eval(rawJs));


    // Cannot get codes right away when calling API
    setTimeout(function() {
        console.log(searchSpec.allergy)
        getMetaCode("allergy", metaData.allergy, Array.from(searchSpec.allergy));
        
        getMetaCode("diet", metaData.diet, searchSpec.diet);


        fetch(createSearchURL())
            .then(handleResponse); //Array results in PromiseValue.matches
                                    // total matches in PromiseValue.totalMatchCount...but does not match array.length???
    }, 1000);

}


/*let cardContainer = document.querySelector("#card-container");
let card = document.createElement("div");
card.classList.add("card");
let cardImg = document.createElement("img");
cardImg.classList.add("img-fluid");
let cardBody = document.createElement("div");
cardBody.classList.add("card-body");
let cardTitle = document.createElement("h4");
cardTitle.classList.add("card-title");
let cardText = document.createElement("p");
cardText.classList.add("card-text");
let cardButton = document.createElement("a");
cardButton.classList.add("btn btn-light-blue");
cardBody.appendChild(cardTitle);
cardBody.appendChild(cardText);
cardBody.appendChild(cardButton);
card.appendChild(cardImg);
card.appendChild(cardBody); */