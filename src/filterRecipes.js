const API_ID = "7db1502d";
const API_KEY = "bccfd4548fc807246ed07d0985509f29";
const MAX = 20;

const URL = "http://api.yummly.com/v1/api/recipes?_app_id=7db1502d&_app_key=bccfd4548fc807246ed07d0985509f29&q=onion+bread+fish&maxResult=1000&maxTotalTimeInSeconds=1800";

let start = 0;

let test = {
    q: ["onion", "bread", "fish"],
    allergy: ["Dairy-Free", "Gluten-Free"],
    diet: ["Pescetarian", "Lacto vegetarian"]
}

function handleResponse(response) {
    if (response != null) {
        return response.json();
    } else {
        return response.json()
            .then(function(err) {
                throw new Error(err.message);
            });
    }
}

function filterResults(data) {
    console.log(data);
    let matches = data.matches;
    let recipes = [];

    for (let i = 0; i < matches.length; i++) {
        let numMatches = 0;
        let ingredients = matches[i].ingredients;
        for (let i = 0; i < ingredients.length; i++) {
            let ingredient = ingredients[i].toLowerCase();
            for (let j = 0; j < test.q.length; j++) {
                if (ingredient.includes(test.q[j])) {
                    numMatches++;
                }
            }
        }
        let percent = numMatches / test.q.length;
        if (percent >= 0.5 && percent <= 1) {
            matches[i].percentMatch = percent;
            recipes.push(matches[i]);
        }
    }

    // sort the recipes by highest percent match
    recipes.sort(function(a, b) {
        return b.percentMatch - a.percentMatch;
    });
    
    let results = recipes.splice(0, 10);
    console.log(results);
}

fetch(URL)
    .then(handleResponse)
    .then(filterResults);