"use strict";

// Gets recipes from the API and populated the view

const API_ID = "135ece56";
const API_KEY = "461b47c5925be6bbc2ec70ad608f7084";
const API_RECIPE_URL = "http://api.yummly.com/v1/api/recipes?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const META_ALLERGY = "http://api.yummly.com/v1/api/metadata/allergy?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const META_DIET = "http://api.yummly.com/v1/api/metadata/diet?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const RECIPE_DETAIL_URL = "http://api.yummly.com/v1/api/recipe/{recipeID}?_app_id=" + API_ID + "&_app_key=" + API_KEY;

/* KEEP THIS CHUNK FOR NOW!!!
let searchSpec = {
    q:["onion", "bread", "fish"], //&q=onion+bread+fish
    allergy: ["Dairy-Free", "Gluten-Free"], //meta data = http://api.yummly.com/v1/api/metadata/allergy?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
                        //format = &allowedAllergy[]=396^Dairy-Free&allowedAllergy[]=393^Gluten-Free
    diet: ["Pescetarian", "Lacto vegetarian"] //meta data = http://api.yummly.com/v1/api/metadata/diet?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
                        //format = &allowedDiet[]=390^Pescetarian&allowedDiet[]=388^Lacto vegetarian
} 
*/


let urlParams = new URLSearchParams(window.location.search);

let resultSearch = {
    ingredients: urlParams.getAll("ingred"),
    allergy: urlParams.getAll("allergy"),
    diet: [urlParams.get("diet")],
   // results: "",
    recipeID:"",
    recipeImg: ""
}

let metaData = {};

function loadPage() {
    setTimeout(showPage, 7000);
}
function showPage() {
  document.querySelector("#progress").style.display = "none";
  document.querySelector("#recipesresults").style.display = "block";
}

//Creates a URL endpoint for the API to grab data
function createSearchURL() {
    //Filter search
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
    }

    //Get allergy data
    let allergySearch = "";
    let allergies = resultSearch.allergy;   
    for (let i = 0; i < allergies.length; i++) {
        for (let j = 0; j < metaData.allergy.length; j++) {
            if (allergies[i] === metaData.allergy[j].shortDescription) {
                allergySearch = allergySearch + "&allowedAllergy[]=" + metaData.allergy[j].id + "^" + allergies[i];
            }
        }
    }
    
    //Get diet data
    let restriction = "";
    let restrictResults = urlParams.get("diet");

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
        //let results = response.json();
        //console.log(results);
        return response.json();
    } else {
        return response.json()
            .then(function(err) {
                throw new Error(err.errorMessage);
            });
    }
}

/**
 * Handles responses from the fetch() API for the meta Data codes.
 * @param {Response} response 
 */
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
                    metaData.allergy.push(codes[j].id);
                } else if (type === "diet") {
                    metaData.diet.push(codes[j].id);
                }
            }
        }
    }
}

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
        .then(renderRecipes)
        .catch(handleError);    //Array results in PromiseValue.matches
}, 2000);




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////HARDCODED THINGS UNDER HERE FOR FORMATTING CARDS, DELETE AFTERWARDS
// Filter the data from the API
function filterResults(data) {

    console.log("filtering")
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

    // sort the recipes by highest percent match
    recipes.sort(function(a, b) {
        return b.percentMatch - a.percentMatch;
    });

    // get the top 100 matches and sort them by lowest number of ingredients
    let topOneHundred = recipes.splice(0, 100);
    topOneHundred.sort(function(a, b) {
        return a.ingredients.length - b.ingredients.length;
    });

    // grab the top 10 recipes
    let results = topOneHundred.slice(0, 10);

    // now take this and display it on the screen... so return it???
    return results;
}

function arrToUl(arr) {
    var div = document.getElementById('ingredients');
    var ul = document.createElement('ul');
    
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {
        var list = arrToUl(arr[i]);
        } else {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(arr[i]));
        console.log(ul.appendChild(li));
        }
        div.appendChild(ul);
    }
}


function renderRecipes(results) {
    //resultSearch.results = data.matches;
    console.log("rendering")
    let cardIndividual = document.querySelector("#individual-recipe");
    for (let i = 0; i < results.length; i++) {
        let cardCol = document.createElement("div");
        cardCol.classList.add("col", "col-md-5", "mx-auto", "mt-2", "mb-4");
        let card = document.createElement("div");
        card.classList.add("card");
        let cardImg = document.createElement("img");
        cardImg.classList.add("img-fluid");
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        let cardTitle = document.createElement("h4");
        cardTitle.classList.add("card-title");
        let cardText = document.createElement("h5");
        cardText.classList.add("card-text");
        let cardButton = document.createElement("a");
        cardButton.classList.add("btn", "btn-pink");
        cardButton.setAttribute("id", "card-button" + i);
        cardButton.setAttribute("data-target", "#recipe-info")
        cardButton.setAttribute("data-toggle", "modal")
        cardButton.textContent = "Get Recipe";
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardButton);
        card.appendChild(cardImg);
        card.appendChild(cardBody);
        cardCol.appendChild(card);
        cardIndividual.appendChild(cardCol);
        

        cardTitle.textContent = results[i].recipeName;
        let time = results[i].totalTimeInSeconds;
        let min = Math.floor(time % 3600 / 60);
        let minDisplay = min > 0 ? min + (min === 1 ? " minute " : " minutes ") : "";
        cardText.textContent = "Cooking Time: " + minDisplay;

        resultSearch.recipeID = results[i].id;
    
        let recipeDetailUrl = RECIPE_DETAIL_URL.replace("{recipeID}", resultSearch.recipeID);
        
        fetch(recipeDetailUrl)
            .then(handleResponse)
            .then(renderRecipeInfo)
            .catch(handleError);
        
        
        function renderRecipeInfo(recipeinfo) {
            
            resultSearch.recipeImg = recipeinfo.images[0].hostedLargeUrl;
            if (resultSearch.recipeImg) {
                cardImg.src = resultSearch.recipeImg;
            } else { 
                cardImg.src = "../img/knife_and_fork.png";
            }
            document.querySelector("#card-button" + i).addEventListener("click", function(){
                console.log(recipeinfo)
                document.querySelector(".modal-title").textContent = recipeinfo.name;
                if (resultSearch.recipeImg) {
                    document.querySelector("#modal-img").src = recipeinfo.images[0].hostedLargeUrl;
                }
                document.querySelector("#ingredients").textContent = "";
                document.querySelector("#ingredients").text = arrToUl(recipeinfo.ingredientLines);
                document.querySelector("#rating").textContent = recipeinfo.rating;
                document.querySelector("#instruction").href = recipeinfo.source.sourceRecipeUrl;
            }); 

        }
        
            
    }
        /*function renderIngredients(results) {
            document.querySelector("#card-button").addEventListener("click", function(){ 
                document.querySelector(".modal-title").textContent = results.name;
            });  
        } */
}
    
document.querySelector("#restartQuiz").addEventListener("click", function(){ 
    let recipeCard = document.querySelector("#individual-recipe");
    recipeCard.innerHTML = "";
}); 
