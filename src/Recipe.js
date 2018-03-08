"use strict";

// Gets recipes from the API, filters the results into the best matches, and displays them for the user.
const API_ID = "135ece56";
const API_KEY = "461b47c5925be6bbc2ec70ad608f7084";
const API_RECIPE_URL = "https://api.yummly.com/v1/api/recipes?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const META_ALLERGY = "https://api.yummly.com/v1/api/metadata/allergy?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const META_DIET = "https://api.yummly.com/v1/api/metadata/diet?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const RECIPE_DETAIL_URL = "https://api.yummly.com/v1/api/recipe/{recipeID}?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const PROGRESS = document.querySelector("#progress");
const RECIPES_RESULTS = document.querySelector("#recipesresults");

// Grab the url parameters from the landing page
let urlParams = new URLSearchParams(window.location.search);

// The inputed ingredients, allergies, and diets for the overall search.
// Also keeps track of each recipe ID and image when displaying the results.
let resultSearch = {
    ingredients: urlParams.getAll("ingred"),
    allergy: urlParams.getAll("allergy"),
    diet: [urlParams.get("diet")],
    recipeID:"",
    recipeImg: ""
}

let metaData = {};

// Creates a URL endpoint for the API to grab data
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

    // Get allergy data
    let allergySearch = "";
    let allergies = resultSearch.allergy;   
    for (let i = 0; i < allergies.length; i++) {
        for (let j = 0; j < metaData.allergy.length; j++) {
            if (allergies[i] === metaData.allergy[j].shortDescription) {
                allergySearch = allergySearch + "&allowedAllergy[]=" + metaData.allergy[j].id + "^" + allergies[i];
            }
        }
    }
    
    // Get diet data
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
 * Handles responses from the fetch() API for the meta data codes.
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

// Gets the metadata values from the JSONP results
function set_metadata(key, value) {
    metaData[key] = value;
}

// Get the codes for the given allergy and/or diet
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

// Changes the allergy and diet metadata 
// into URL codes to add to the endpoint
fetch(META_ALLERGY)
    .then(parseMetaData)
    .then(rawJs => eval(rawJs))
    .catch(handleError);

fetch(META_DIET)
    .then(parseMetaData)
    .then(rawJs => eval(rawJs))
    .catch(handleError);
    
// Fetch the data from the API with the given endpoint.
// Show a loading icon until the results are returned and rendered.
setTimeout(function() {
    PROGRESS.classList.remove("d-none");
    getMetaCode("allergy", metaData.allergy, resultSearch.allergy);
    getMetaCode("diet", metaData.diet, resultSearch.diet);
    fetch(createSearchURL())
        .then(handleResponse)
        .then(filterResults)
        .then(renderRecipes)
        .catch(handleError)
        .then(function() {
            PROGRESS.classList.add("d-none");
            RECIPES_RESULTS.classList.remove("d-none");
        });
}, 2000);

// Filter the results from the API into recipes
// with the highest number of matching ingredients.
// Picks the top 10 recipes with the fewest total
// ingredients.
function filterResults(data) {
    let matches = data.matches;
    let recipes = [];

    // Look at the ingredients of each recipe, see how many match,
    // and keep track of them if more than half of the ingredients
    // match.
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
    return results;
}

// Renders the 10 (or fewer) recipes that were filtered through the results.
// Let the user know if there are no results found.
function renderRecipes(results) {
    if (results.length === 0) {
        let noResult = document.createElement("h2");
        noResult.classList.add("white-text", "mt-5", "text-center");
        noResult.textContent= "No results found! Try another search.";
        document.querySelector("#no-result").appendChild(noResult);
    }

    let cardIndividual = document.querySelector("#individual-recipe");
    for (let i = 0; i < results.length; i++) {
        // Make the column for each card
        let cardCol = document.createElement("div");
        cardCol.classList.add("d-flex", "col", "col-md-5", "mx-auto", "mt-2", "mb-4");
        let card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("id", "card" + i);
        card.setAttribute("data-target", "#recipe-info")
        card.setAttribute("data-toggle", "modal")

        // Make each card image and body
        let cardImg = document.createElement("img");
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        let cardTitle = document.createElement("h4");
        cardTitle.classList.add("card-title");
        let cardText = document.createElement("h5");
        cardText.classList.add("card-text");
        let cardButton = document.createElement("a");
        cardButton.classList.add("btn", "btn-pink");
        cardButton.textContent = "Get Recipe";
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardButton);
        card.appendChild(cardImg);
        card.appendChild(cardBody);
        cardCol.appendChild(card);
        cardIndividual.appendChild(cardCol);
        
        // Add the recipe name and convert total cook time to minutes
        cardTitle.textContent = results[i].recipeName;
        let time = results[i].totalTimeInSeconds;
        let min = Math.floor(time % 3600 / 60);
        let minDisplay = min > 0 ? min + (min === 1 ? " minute " : " minutes ") : "";
        cardText.textContent = "Cooking Time: " + minDisplay;

        // Create the URL for getting each individual recipe
        resultSearch.recipeID = results[i].id;
        let recipeDetailUrl = RECIPE_DETAIL_URL.replace("{recipeID}", resultSearch.recipeID);
        
        // Fetch the individual recipe image
        fetch(recipeDetailUrl)
            .then(handleResponse)
            .then(renderRecipeInfo)
            .catch(handleError);
        
        // Gets and sets the recipe image from the API
        // If there's no image, set it to the default N/A
        function renderRecipeInfo(recipeinfo) {
            resultSearch.recipeImg = recipeinfo.images[0].hostedLargeUrl;
            if (resultSearch.recipeImg) {
                // Sometimes returns HTTP instead of HTTPS, resulting in console warnings
                // Please ignore (since it's not our fault but yummly's)
                cardImg.src = resultSearch.recipeImg;
            } else { 
                cardImg.src = "img/knife_and_fork.png";
            }
            // When the user clicks on the card, display extra recipe
            // information and a link to the external recipe.
            document.querySelector("#card" + i).addEventListener("click", function(){
                document.querySelector(".modal-title").textContent = recipeinfo.name;
                if (recipeinfo.images[0].hostedLargeUrl) {
                    document.querySelector("#modal-img").src = recipeinfo.images[0].hostedLargeUrl;
                } else {
                    document.querySelector("#modal-img").src = "";
                }
                var array = recipeinfo.ingredientLines;
                document.getElementById("ingredients").innerHTML = '<ul><li>' + array.join("</li><li>"); + '</li></ul>';
                document.querySelector("#rating").textContent = recipeinfo.rating + " / 5";
                document.querySelector("#instruction").href = recipeinfo.source.sourceRecipeUrl;
            }); 
        }           
    }
}

// When the user clicks the restart button, send them back to the homepage.
document.querySelector("#restartQuiz").addEventListener("click", function(){ 
    let recipeCard = document.querySelector("#individual-recipe");
    recipeCard.innerHTML = "";
}); 
