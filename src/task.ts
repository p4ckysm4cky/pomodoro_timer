function makeDistract(distraction: string) {
    /**
     * Creates a 'li' element using the string passed in
     * and includes an event to remove upon clicked.
     * Is added to distractions array everytime this function
     * is ran.
     */
    distractions.push(distraction);
    updateStorage();
    let newLi = document.createElement("li");
    newLi.innerHTML = distraction;
    newLi.addEventListener("click", () => {
        newLi.remove();
        const removeIndex = distractions.indexOf(distraction);
        if (removeIndex > -1) {
            let removedItem = distractions.splice(removeIndex, 1);
            removedDistractions.unshift(removedItem[0]);
        } else {
            console.log("An Error occurred in removing distraction");
        }
        updateStorage();
    });
    return newLi;
}

function watchInput() {
    /**
     * Add an event to the input box and button, so that when the
     * user inputs a new distraction it creates a new item in the
     * distraction list
     */
    const addToList = () => {
        // HTMLInputElement is used to cast the element so it is typesafe
        const searchBox = <HTMLInputElement>(
            document.getElementById("distractionInput")
        );
        let distractionStr: string = searchBox.value;
        searchBox.value = "";
        distractionList.appendChild(makeDistract(distractionStr));
    };

    const submitBtn = document.getElementById("inputBtn");
    submitBtn.addEventListener("click", addToList);
    const searchBox = document.getElementById("distractionInput");
    searchBox.addEventListener("keyup", (event) => {
        if ("Enter" === event.key) addToList();
    });
}

function updateStorage() {
    /**
     * This function needs to run everytime we make changes to
     * the distractions array to store in localStorage
     */
    let stringifyDistractions = JSON.stringify(distractions);
    localStorage.setItem("distractions", stringifyDistractions);
}

function loadDistractions() {
    /**
     * If distraction is stored in localStorage
     * it is pushed back into the distractions
     * array and renders it to html
     */
    if (localStorage.distractions) {
        const tempArray = JSON.parse(localStorage.distractions);
        // add string for tempArray back into distractions
        tempArray.forEach((element) => {
            distractionList.appendChild(makeDistract(element));
        });
    }
}

const distractionList = document.getElementById("distractionContainer");
let distractions: Array<string> = [];
let removedDistractions: Array<string> = [];
loadDistractions();
watchInput();

// Strat for dealing with multi-key presses
let keysPressed = {};
// add keydown to object when pressed down
document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;
});
// remove keydown to object when released
document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key];
});
// check if ctrl + z is pressed
document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;
    if (keysPressed["Control"] && event.key == "z") {
        if (removedDistractions.length > 0) {
            let item = removedDistractions.shift();
            distractionList.appendChild(makeDistract(item));
        }
    }
});
