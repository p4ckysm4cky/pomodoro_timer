function makeDistract(distraction: string) {
    let newLi = document.createElement("li");
    newLi.innerHTML = distraction;
    newLi.addEventListener("click", () => {
        newLi.remove();
    });
    return newLi;
}

function main() {
    const distractionList = document.getElementById("distractionContainer");
    distractionList.appendChild(makeDistract("hi"));
    distractionList.appendChild(makeDistract("nice"));
    distractionList.appendChild(makeDistract("good"));
}

main();
