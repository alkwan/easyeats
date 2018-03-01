//Interact and filter from the Yummly API

const SEARCH_API = "http://api.yummly.com/v1/api";
const API_ID = "135ece56";
const API_KEY = "461b47c5925be6bbc2ec70ad608f7084";

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

/**
 * Handles errors that occur while fetching
 * @param {Error} err 
 */
function handleError(err) {
    console.error(err);
    ERROR_ALERT_DIV.textContent = err.message;
    ERROR_ALERT_DIV.classList.remove("d-none");
}

/*
fetch())
    .then(handleResponse)
    .catch(handleError);
    */