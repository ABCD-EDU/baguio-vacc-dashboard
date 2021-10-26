var vaccineValues = [];
var ageGroupValues = [];
var vaccineMax = 0;
var ageGroupMax = 0;
var barSpacing = 0;
var defaultLocation = "Baguio City";
var selectedLocation = "Baguio City";

var brandGraphNumerical = true;
var ageGraphNumerical = true;
var ageIsAscending = true;
var brandIsAscending = true;

initializeBarangaySelector();

function onGraphButtonClick(id) {
    let ageClicked = false;
    let brandClicked = false;
    if (id === "percentageButton-perAge") {
        ageGraphNumerical = false;
        ageClicked = true;
    } else if (id === "vaccinatedButton-perAge") {
        ageGraphNumerical = true;
        ageClicked = true;
    } else if (id === "ascendingButton-perAge") {
        ageIsAscending = true;
        ageClicked = true;
    } else if (id === "descendingButton-perAge") {
        ageIsAscending = false;
        ageClicked = true;
    } else if (id === "percentageButton-perBrand") {
        brandGraphNumerical = false;
        brandClicked = true;
    } else if (id === "vaccinatedButton-perBrand") {
        brandGraphNumerical = true;
        brandClicked = true;
    } else if (id === "ascendingButton-perBrand") {
        brandIsAscending = true;
        brandClicked = true;
    } else if (id === "descendingButton-perBrand") {
        brandIsAscending = false;
        brandClicked = true;
    }
    if (ageClicked === true) {
        const ageGrpContainer = document.getElementById("ageGroupContainer");
        ageGrpContainer.innerHTML = '';
        initializeAgeGroupData(selectedLocation, ageGraphNumerical, ageIsAscending);
    }else if (brandClicked === true); {
        const ageGrpContainer = document.getElementById("brgyContainer");
        ageGrpContainer.innerHTML = '';
        initializeVaccineTypeData(selectedLocation, brandGraphNumerical, brandIsAscending);
    }
}

async function initializeBarangaySelector() {
    const selector = document.getElementById("barangaySelector");
    let barangays = await getBarangayNames();
    barangays.unshift("Baguio City");
    for (let i = 0; i < barangays.length; i++) {
        let opt = document.createElement('option');
        opt.value = barangays[i];
        opt.innerHTML = barangays[i];
        selector.appendChild(opt);
    }
    onBarangayChange();
}

async function onBarangayChange() {
    const barangay = document.getElementById("barangaySelector").value;
    let data = null;
    if (barangay === "Baguio City") {
        data = await getCityData();
    } else {
        data = await getBarangayData(barangay);
    }
    data = data["category"];

    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        let category = keys[i];
        document.getElementById(category + "-Data").textContent = data[category];
    }
    selectedLocation = barangay;
    removeChildrenOfGraphContainers();
    initializeVaccineTypeData(barangay, brandGraphNumerical, brandIsAscending);
    initializeAgeGroupData(barangay, ageGraphNumerical, ageIsAscending);
}

function removeChildrenOfGraphContainers() {
    const brgayContainer = document.getElementById("brgyContainer");
    brgayContainer.innerHTML = '';
    const ageGrpContainer = document.getElementById("ageGroupContainer");
    ageGrpContainer.innerHTML = '';
}

function getMaxValue(data) {
    let max = 0;
    for (let [key, value] of Object.entries(data)) {
        max = Math.max(max, value);
    }
    return max;
}

function initializeVaccineTypeData(location, isNumerical, isAscending) {
    let totalVaccinated = null
    if (!isNumerical) {
        getTotalVaccinated(location).then(data => {
            totalVaccinated = data;
        })
    }
    getVaccineTypeData(location, isAscending)
        .then(data => {
            const brgyContainer = document.getElementById("brgyContainer");
            var count = 0;
            vaccineMax = getMaxValue(data);
            for (let [key, value] of Object.entries(data)) {
                
                const rowContainer = document.createElement("div");
                rowContainer.id = "brgyRow";
                vaccineValues[count] = value;
                const nameContainer = document.createElement("div");
                const barContainer = document.createElement("div");

                nameContainer.className = "vaccine";
                barContainer.className = "bar";
                
                nameContainer.innerHTML += `${key}`;
                if (!isNumerical) {
                    barContainer.innerHTML += `${roundValue(value, totalVaccinated)}%`;
                }else {
                    barContainer.innerHTML += `${value}`;
                }

                addStyleToName(nameContainer);
                addStyleToBar(barContainer, value, vaccineMax);

                rowContainer.appendChild(nameContainer);
                rowContainer.appendChild(barContainer);

                brgyContainer.appendChild(rowContainer);
                count++;
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function initializeAgeGroupData(location, isNumerical, isAscending) {
    let totalVaccinated = null
    if (!isNumerical) {
        getTotalVaccinated(location).then(data => {
            totalVaccinated = data;
        })
    }
    getAgeGroupData(location, isAscending)
        .then(data => {
            const brgyContainer = document.getElementById("ageGroupContainer");
            var count = 0;
            ageGroupMax = getMaxValue(data);
            
            for (let [key, value] of Object.entries(data)) {
                const rowContainer = document.createElement("div");
                rowContainer.id = "ageGroupRow";
                ageGroupValues[count] = value;
                const nameContainer = document.createElement("div");
                const barContainer = document.createElement("div");

                nameContainer.className = "age";
                barContainer.className = "ageBar";

                nameContainer.innerHTML += `${key}`;
                if (!isNumerical) {
                    barContainer.innerHTML += `${roundValue(value, totalVaccinated)}%`;
                } else {
                    barContainer.innerHTML += `${value}`;
                }

                addStyleToName(nameContainer);
                addStyleToBar(barContainer, value, ageGroupMax);

                rowContainer.appendChild(nameContainer);
                rowContainer.appendChild(barContainer);

                brgyContainer.appendChild(rowContainer);
                count++;
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function roundValue(value, totalVaccinated) {
    const val = (value / totalVaccinated) * 100;
    if (val < 1 && val != 0) {
        return val.toFixed(2);
    }else {
        return Math.round(val);
    }
}

function addStyleToName(name) {
    name.style.display = "block";
    name.style.paddingTop = "0.8rem";
    name.style.paddingBottom = "0.45rem";
    name.style.fontFamily = "Roboto";
    name.style.fontSize = "20px";
    name.style.textAlign = "center";
    name.style.width = "300px";
    name.style.flexShrink = "0";

    name.style.color = "white";
}

function addStyleToBar(bar, value, max) {
    const BASE_WIDTH = document.body.clientWidth - barSpacing;
    const NEW_WIDTH = (value / max) * BASE_WIDTH;

    bar.style.backgroundColor = "#FFD57B";
    bar.style.width = `${NEW_WIDTH}px`;
    bar.style.display = "flex";
    bar.style.justifyContent = "center";
    bar.style.alignItems = "center";
    bar.style.margin = "0.5rem";
    bar.style.borderRadius = "5px";
    bar.style.height = "35px";
}

var width = document.body.clientWidth;
if (width <= 768) {
    barSpacing = 100;
} else if (width > 768 && width <= 1080) {
    barSpacing = 330;
} else if (width > 1080) {
    barSpacing = 700;
}

/**
 * @title MAGIC FUNCTION TO MAKE BAR CHART RESPONSIVE
 * 
 * @how
 * onresize refreshes everytime the window size changes.
 * 
 * In order to reset the width of the bars, loop over each item
 * and compute new base width and the computed width.
 */
window.addEventListener("resize", function () {
    var width = document.body.clientWidth;
    if (width <= 768) {
        barSpacing = 100;
    } else if (width > 768 && width <= 1080) {
        barSpacing = 330;
    } else if (width > 1080) {
        barSpacing = 700;
    }
    // console.log(barSpacing)
    for (var i = 0; i < vaccineValues.length; i++) {
        // Compute new width based on client's width
        const BASE_WIDTH = document.body.clientWidth - barSpacing;
        const NEW_WIDTH = (vaccineValues[i] / vaccineMax) * BASE_WIDTH;

        // console.log(NEW_WIDTH)

        // set new width for each bar
        let bar = document.getElementsByClassName("bar");
        bar[i].style.width = `${NEW_WIDTH}px`;
    }

    for (var i = 0; i < ageGroupValues.length; i++) {
        // Compute new width based on client's width
        const BASE_WIDTH = document.body.clientWidth - barSpacing;
        const NEW_WIDTH = (ageGroupValues[i] / ageGroupMax) * BASE_WIDTH;

        // set new width for each bar
        let bar = document.getElementsByClassName("ageBar");
        bar[i].style.width = `${NEW_WIDTH}px`;
    }
});


initializeVaccineTypeData("Ambiong");
initializeAgeGroupData("Ambiong");