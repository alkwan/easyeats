// Gets recipes from the API and populated the view

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


let urlParams = new URLSearchParams(window.location.search);

let resultSearch = {
    ingredients: urlParams.getAll("ingred"),
    allergy: urlParams.getAll("allergy"),
    diet: [urlParams.get("diet")],
}

let metaData = {};


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
    //console.log(metaData.diet) UI needs Lacto-ovo vegetarian and Paleo, remove just vegetarian

    if (restrictResults && restrictResults !== "") {
        for (let i = 0; i < metaData.diet.length; i++) {
            if (metaData.diet[i].shortDescription === restrictResults) {
                restriction = "&allowedDiet[]=" + metaData.diet[i].id + "^" + restrictResults;
            }
        }
    }

    let endpoint = API_RECIPE_URL + search + allergySearch + restriction;
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




let resultArray = [];


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
        .catch(handleError);    //Array results in PromiseValue.matches


//hardcoded array recipes
fetch("http://api.yummly.com/v1/api/recipes?_app_id=135ece56&_app_key=461b47c5925be6bbc2ec70ad608f7084&q=bread+onion+soup&allowedAllergy[]=393^Gluten-Free&allowedAllergy[]=394^Peanut-Free&allowedDiet[]=390^Pescetarian")
    .then(handleResponse)
    .then(getArrayMatches)
    .catch(handleError);

 ////////////////////////////////////////////////////////////////


}, 2000);




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////HARDCODED THINGS UNDER HERE FOR FORMATTING CARDS, DELETE AFTERWARDS

function getArrayMatches(result) {
    resultArray = result.matches;
}

