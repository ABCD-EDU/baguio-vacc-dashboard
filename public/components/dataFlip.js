function insertDataFlipper(component) {
    addDivStyling(component);

    let numberContainer = document.createElement("div");

    numberContainer.id = "numberContainer";

    let percentageButton = document.createElement("button");
    let vaccinatedButton = document.createElement("button");

    percentageButton.id = "percentageButton";
    vaccinatedButton.id = "vaccinatedButton";

    percentageButton.innerHTML += "Percentage";
    vaccinatedButton.innerHTML += "Vaccinated";

    addButtonStyling(percentageButton);
    addButtonStyling(vaccinatedButton);

    numberContainer.appendChild(percentageButton);
    numberContainer.appendChild(vaccinatedButton);

    let sortContainer = document.createElement("div");
    sortContainer.id = "sortContainer";

    let ascendButton = document.createElement("button");
    let descendButton = document.createElement("button");

    ascendButton.id = "ascendButton";
    descendButton.id = "descendButton";

    ascendButton.innerHTML += "Ascending"
    descendButton.innerHTML += "Descending"

    addButtonStyling(ascendButton);
    addButtonStyling(descendButton);

    sortContainer.appendChild(ascendButton);
    sortContainer.appendChild(descendButton);

    component.appendChild(numberContainer);
    component.appendChild(sortContainer);
}

function addButtonStyling(button) {
    button.style.backgroundColor = "red";
    button.style.border = "none";
    
    button.style.fontSize = "1rem";
    button.style.fontFamily = "Roboto";
    button.style.fontWeight = "500";
    
    button.style.width = "150px";
    button.style.padding = "0.5rem 1rem";
    button.style.margin = "0 0.5rem";

    button.style.borderRadius = "1rem";
}

function addDivStyling(div) {
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.width = "80%";
    div.style.margin = "0 auto";
}

insertDataFlipper(document.getElementById("brgyDataFlip"))
insertDataFlipper(document.getElementById("ageGroupDataFlip"))