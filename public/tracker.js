var vaccineValues = []

async function initializeBarangaySelector() {
    let barangays = await getBarangayNames();
    let selector = document.getElementById("barangaySelector");
    for (let i = 0; i < barangays.length; i++) {
        let opt = document.createElement('option');
        opt.value = barangays[i];
        opt.innerHTML = barangays[i];
        selector.appendChild(opt);
    }
    onBarangayChange();
}

initializeBarangaySelector();

async function onBarangayChange() {
    let barangay = document.getElementById("barangaySelector").value;
    let data = await getBarangayData(barangay);
    data = data["category"];

    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        let category = keys[i];
        document.getElementById(category + "-Data").textContent=data[category];
    }
    
}


function getMaxBarangayVaccine(data) {
    let max = 0;
    for (let [key, value] of Object.entries(data)) {
        max = Math.max(max, value);
    }
    return max;
}

getVaccineTypeData("Ambiong")
    .then(data => {
        const brgyContainer = document.getElementById("brgyContainer");
        var count = 0;
        max = getMaxBarangayVaccine(data);
        console.log(max)
        const leftContainer = document.createElement("div");
        leftContainer.id = "leftContainer"
        const rightContainer = document.createElement("div");
        rightContainer.id = "rightContainer"

        leftContainer.style.width = "300px";

        brgyContainer.appendChild(leftContainer);
        brgyContainer.appendChild(rightContainer);
        for (let [key, value] of Object.entries(data)) {

            vaccineValues[count] = value;
            leftContainer.innerHTML += `<span class=\"vaccine\">${key}</span>`
            rightContainer.innerHTML += `<div class=\"bar\">${value}</div>`

            const BASE_WIDTH = document.body.clientWidth - 670;
            const NEW_WIDTH = (value / max) * BASE_WIDTH;

            let vaccine = document.getElementsByClassName("vaccine")
            let bar = document.getElementsByClassName("bar");

            bar[count].style.backgroundColor = "#FFD57B";
            bar[count].style.width = `${NEW_WIDTH}px`;
            bar[count].style.display = "flex";
            bar[count].style.justifyContent = "center";
            bar[count].style.alignItems = "center";
            bar[count].style.margin = "0.5rem";
            bar[count].style.borderRadius = "5px";
            bar[count].style.height = "35px";

            vaccine[count].style.display = "block";
            vaccine[count].style.paddingTop = "0.8rem";
            vaccine[count].style.paddingBottom = "0.45rem";
            vaccine[count].style.fontFamily = "Roboto";
            vaccine[count].style.fontSize = "20px";

            count++;
        }
    })
    .catch(err => {
        console.log(err);
    })

// getAgeGroupData("Ambiong")
// .then(data => {
//     const brgyContainer = document.getElementById("ageGroupContainer");
//     var count = 0;
//     var max = getMaxBarangayVaccine(data);
//     console.log(max)
//     const leftContainer = document.createElement("div");
//     leftContainer.id = "leftContainer"
//     const rightContainer = document.createElement("div");
//     rightContainer.id = "rightContainer"

//     leftContainer.style.width = "300px";

//     brgyContainer.appendChild(leftContainer);
//     brgyContainer.appendChild(rightContainer);
//     for (let [key, value] of Object.entries(data)) {
//         leftContainer.innerHTML += `<span class=\"ageGroup\">${key}</span>`
//         rightContainer.innerHTML += `<div class=\"bar\">${value}</div>`

//         const BASE_WIDTH = 1150;
//         const NEW_WIDTH = (value / max) * BASE_WIDTH;

//         document.getElementById(`bar`).style.backgroundColor = "#FFD57B";
//         document.getElementById(`bar`).style.width = `${NEW_WIDTH}px`;
//         document.getElementById(`bar`).style.display = "flex";
//         document.getElementById(`bar`).style.justifyContent = "center";
//         document.getElementById(`bar`).style.alignItems = "center";
//         document.getElementById(`bar`).style.margin = "0.5rem";
//         document.getElementById(`bar`).style.borderRadius = "5px";
//         document.getElementById(`bar`).style.height = "35px";

//         document.getElementById(`vaccine`).style.display = "block";
//         document.getElementById(`vaccine`).style.paddingTop = "0.8rem";
//         document.getElementById(`vaccine`).style.paddingBottom = "0.45rem";
//         document.getElementById(`vaccine`).style.fontFamily = "Roboto";
//         document.getElementById(`vaccine`).style.fontSize = "20px";
//         count++;
//     }
// })
// .catch(err => {
//     console.log(err);
// })

/**
 * @title MAGIC FUNCTION TO MAKE BAR CHART RESPONSIVE
 * 
 * @how
 * onresize refreshes everytime the window size changes.
 * 
 * In order to reset the width of the bars, loop over each item
 * and compute new base width and the computed width.
 */
window.onresize = function () {
    for (var i = 0; i < vaccineValues.length; i++) {
        // Compute new width based on client's width
        const BASE_WIDTH = document.body.clientWidth - 670;
        const NEW_WIDTH = (vaccineValues[i] / max) * BASE_WIDTH;

        // set new width for each bar
        let bar = document.getElementsByClassName("bar");
        bar[i].style.width = `${NEW_WIDTH}px`;
    }
};
