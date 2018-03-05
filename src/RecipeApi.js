//Interact and filter from the Yummly API

const API_ID = "135ece56";
const API_KEY = "461b47c5925be6bbc2ec70ad608f7084";
const API_RECIPE_URL = "http://api.yummly.com/v1/api/recipes?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const META_ALLERGY = "http://api.yummly.com/v1/api/metadata/allergy?_app_id=" + API_ID + "&_app_key=" + API_KEY;
const META_DIET = "http://api.yummly.com/v1/api/metadata/diet?_app_id=" + API_ID + "&_app_key=" + API_KEY;


let test = {
    q:["onion", "bread", "fish"], //&q=onion+bread+fish
    allergy: ["Dairy-Free", "Gluten-Free"], //meta data = http://api.yummly.com/v1/api/metadata/allergy?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
                        //format = &allowedAllergy[]=396^Dairy-Free&allowedAllergy[]=393^Gluten-Free
    diet: ["Pescetarian", "Lacto vegetarian"] //meta data = http://api.yummly.com/v1/api/metadata/diet?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
                        //format = &allowedDiet[]=390^Pescetarian&allowedDiet[]=388^Lacto vegetarian
} 

let searchSpec = { //Data from quiz here
    q: "",
    allergy: "",
    diet:""
}

let resultCodes = {
    allergy: [],
    diet: []
}


function createSearchURL() {
    //Filter search
    let search = "";
    let ingreds = test.q;
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
    let allergies = test.allergy;
    if (allergies.length > 0) {
        for (let i = 0; i < allergies.length; i++) {
            allergySearch = allergySearch + "&allowedAllergy[]=" + resultCodes.allergy[i] + "^" + allergies[i];
        }
    }

    //Get restriction data
    let restriction = "";
    let restrictResults = test.diet;
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
        console.log(results)
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

//Handles Metadata URL codes
let metaData = {};
fetch(META_ALLERGY)
    .then(parseMetaData)
    .then(rawJs => eval(rawJs));

fetch(META_DIET)
    .then(parseMetaData)
    .then(rawJs => eval(rawJs));


// Cannot get codes right away when calling API
setTimeout(function() {
    getMetaCode("allergy", metaData.allergy, test.allergy);
    getMetaCode("diet", metaData.diet, test.diet);


    fetch(createSearchURL())
        .then(handleResponse); //Array results in PromiseValue.matches
                                // total matches in PromiseValue.totalMatchCount...but does not match array.length???
}, 1000);
