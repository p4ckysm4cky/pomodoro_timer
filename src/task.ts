function makeDistract(distraction: string) {
    /**
     * Creates a 'li' element using the string passed in
     * and includes an event to remove upon clicked
     */
    let newLi = document.createElement("li");
    newLi.innerHTML = distraction;
    newLi.addEventListener("click", () => {
        newLi.remove();
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
        const distractionList = document.getElementById("distractionContainer");
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

function main() {
    watchInput();
}

main();
