/**
 * This javascript file is intended to be used for accessing and retrieving
 * data from the created JSON file.
 * 
 */

const JSON_PATH = '../res/data/baguio-city.json';

/**
 * @author Arevalo, Bayquen
 * @returns names of all barangays
 */
async function getBarangayNames() {
    const res = await fetch(JSON_PATH, { mode: 'no-cors' })

    const masterData = await res.json();
    const data = masterData["barangays"];
    let names = []
    for (var i = 0; i < data.length; i++) {
        names.push(data[i].name)
    }
    return names
}

/**
 * @author Cayton
 * @param barangayCountGiven - number of barangays to return
 * @returns top N Vaccinated barangays with all of their data
 */
async function getTopNVaccinatedBarangays(barangayCountGiven) {
    const output = await getAllVaccinatedPerBarangay(true)
    return output.slice(0, barangayCountGiven)
}

/**
 * @author Bayquen
 * Ranks barangays based on their vaccinated/total population percentage
 * @param isAscending - Sorting of data to be returned
 * @returns Top 10 barangays and all their data
 */
async function getTop10PercentageBarangays(isAscending) {
    let data = await getAllBarangayData();
    data.forEach(function (element) {
        element.percentage = (element.vaccinated / element.population) * 100;
    });
    data.sort(sortJSONByValue("percentage",isAscending));
    data = data.slice(0, 10);
    return data;
}

/**
 * @author Bayquen
 * Ranks barangays based on their vaccinated/total population percentage
 * but only returns the barangay's name and vaccination percentage
 * @param isAscending - Sorting of data to be returned
 * @returns Returns vaccination percentage of top 10 barangays
 */
async function getTop10PercentageBarangaysPercentages(isAscending) {
    let toReturn = {};
    const data = await getTop10PercentageBarangays(isAscending);
    data.forEach(e => {
        toReturn[e.name] = e.percentage;
    })
    return toReturn;
}

/**
 * @author Bayquen
 * Ranks barangays based on their vaccinated/total population percentage
 * but only returns the barangay's name and vaccination population
 * @param isAscending - Sorting of data to be returned
 * @returns Returns number of vaccinated population of top 10 barangays
 */
async function getTop10PercentageBarangaysVaccinated(isAscending) {
    let toReturn = [];
    const data = await getTop10PercentageBarangays(isAscending);
    data.forEach(e => {
        toReturn.push(e.vaccinated);
    })
    return toReturn;
}

async function getAllPopulationPerBarangay(isSorted) {
    const brgyData = await getAllBarangayData();
    const list = []

    for (let i = 0; i < brgyData.length; i++) {
        let output = {}

        const name = brgyData[i].name;
        const vaccinated = brgyData[i].population;

        output["name"] = name;
        output["population"] = parseInt(vaccinated, 10)
        list.push(output);
    }

    if (isSorted) {
        list.sort(sortJSONByValue("population", false))
        return list
    } else {
        return list
    };
}

async function getAllVaccinatedPerBarangay(isSorted) {

    const brgyData = await getAllBarangayData();
    const list = []

    for (let i = 0; i < brgyData.length; i++) {
        let output = {}

        const name = brgyData[i].name;
        const vaccinated = brgyData[i].vaccinated;

        output["name"] = name;
        output["vaccinated"] = parseInt(vaccinated, 10)
        list.push(output);
    }

    if (isSorted) {
        list.sort(sortJSONByValue("vaccinated", false))
        return list
    } else {
        return list
    };
}

/**
 * @author Cayton
 * @param {*} prop 
 * @param {*} isAscending 
 * @returns Sorted JSON object based on a property's value
 */
function sortJSONByValue(prop, isAscending) {
    return function (a, b) {
        if (isAscending) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        } else {
            if (a[prop] < b[prop]) {
                return 1;
            } else if (a[prop] > b[prop]) {
                return -1;
            }
            return 0;
        }
    }
}


async function getData() {
    const res = await fetch(JSON_PATH, { mode: 'no-cors' })

    const data = await res.json();
    return data;
}

async function getAllBarangayData() {
    const res = await fetch(JSON_PATH, { mode: 'no-cors' })
    const masterData = await res.json();
    const data = masterData["barangays"];
    return data;
}

async function getBarangayData(location) {
    const res = await fetch(JSON_PATH, { mode: 'no-cors' });

    const masterData = await res.json();
    const data = masterData["barangays"];
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == location) {
            return data[i]
        }
    }
}

/**
 * @author Bayquen
 * @returns Data of main city without the barangays
 */
async function getCityData() {
    const res = await fetch(JSON_PATH, { mode: 'no-cors' });
    const data = await res.json();
    delete data["barangays"];
    return data;
}

/**
 * @author Bayquen
 * @param {*} location - location whose data is retrieved
 * @param {*} isAscending 
 * @returns JSON object of key: brand, value: quantity pair
 */
async function getVaccineTypeData(location, isAscending) {
    let data = null;
    if (location === "Baguio City") {
        data = await getCityData();
    } else {
        data = await getBarangayData(location);
    }
    data = sortAccordingToKeys(data.vaccineType, isAscending);
    return data;
}

/**
 * @author Bayquen
 * @param {*} location - location whose data is retrieved
 * @param {*} isAscending
 * @returns JSON object of key: age, value: quantity pair
 */
async function getAgeGroupData(location, isAscending) {
    let data = null;
    if (location === "Baguio City") {
        data = await getCityData();
    } else {
        data = await getBarangayData(location);
    }
    data = sortAccordingToKeys(data.ageGroup, isAscending);
    return data;
}

async function getPopulation(location) {
    let data = null;
    if (location === "Baguio City") {
        data = await getCityData();
    } else {
        data = await getBarangayData(location);
    }
    return data.population;
}

async function getTotalVaccinated(location) {
    let data = null;
    if (location === "Baguio City") {
        data = await getCityData();
    } else {
        data = await getBarangayData(location);
    }
    return data.vaccinated;
}

async function getCategoryData(location) {
    const barangayData = await getBarangayData(location);
    return barangayData.Category;
}

async function getSexData(location) {
    const barangayData = await getBarangayData(location);
    return barangayData.perSex;
}

async function getBarangayPopulationData(location) {
    const barangayData = await getBarangayData(location);
    return barangayData.population;
}

async function getBarangayVaccinatedData(location) {
    const barangayData = await getBarangayData(location);
    return barangayData.vaccinated;
}

async function getMaxBarangayVaccine(location) {
    const barangayData = await getBarangayData(location);
    const data = barangayData.vaccineType;

    var max = 0;
    for (let [key, value] of Object.entries(data)) {
        if (value > max) {
            console.log(value)
            console.log(max)
            max = value;
        }
    }
    return max;
}

/**
 * @author Cayton
 * @param {*} object 
 * @param {*} isAscending 
 * @returns Sorts a javascript object based on a given property
 */
function sortAccordingToKeys(object, isAscending) {
    let sortable = [];
    for (let obj in object) {
        sortable.push([obj, object[obj]]);
    }
    if (isAscending) {
        sortable.sort(function (a, b) {
            return a[1] - b[1];
        })
    } else {
        sortable.sort(function (a, b) {
            return b[1] - a[1];
        })
    }
    let sorted = {};
    for (let i = 0; i < sortable.length; i++) {
        const element = sortable[i];
        sorted[element[0]] = element[1];
    }
    return sorted;
}