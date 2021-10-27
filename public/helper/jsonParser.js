async function getBarangayNames() {
    const res = await fetch('../res/data/test.json', { mode: 'no-cors' })

    const masterData = await res.json();
    const data = masterData["barangays"];
    let names = []
    for (var i = 0; i < data.length; i++) {
        names.push(data[i].name)
    }
    return names
}

async function getTopNVaccinatedBarangays(barangayCountGiven) {
    const output = await getAllVaccinatedPerBarangay(true)
    return output.slice(0, barangayCountGiven)
}

async function getTop10PercentageBarangays(isAscending) {
    let data = await getAllBarangayData();
    data.forEach(function (element) {
        element.percentage = (element.vaccinated / element.population) * 100;
    });
    data.sort(sortJSONByValue("percentage",isAscending));
    data = data.slice(0, 10);
    return data;
}

async function getTop10PercentageBarangaysPercentages(isAscending) {
    let toReturn = {};
    const data = await getTop10PercentageBarangays(isAscending);
    data.forEach(e => {
        toReturn[e.name] = e.percentage;
    })
    return toReturn;
}

async function getTop10PercentageBarangaysVaccinated(isAscending) {
    let toReturn = [];
    const data = await getTop10PercentageBarangays(isAscending);
    data.forEach(e => {
        toReturn.push(e.vaccinated);
    })
    return toReturn;
}

async function getTopNBarangaysWithVaccinatedNumber(barangayCountGiven, isAscending) {
    let toReturn = {}
    let output = await getAllVaccinatedPerBarangay(true);
    output = output.slice(0, barangayCountGiven);
    // descending
    if (!isAscending) {
        for (let i = 0; i < output.length; i++) {
            const barangay = output[i];
            toReturn[barangay.name] = barangay.vaccinated;
        }
    }else {
        for (let i = output.length-1; i > -1; i--) {
            const barangay = output[i];
            toReturn[barangay.name] = barangay.vaccinated;
        }
    }
    return toReturn;
}

async function getPopulationOfTop10VaccinatedBarangays(barangayCountGiven, isAscending) {
    let toReturn = []
    let output = await getAllPopulationPerBarangay(true)
    output =  output.slice(0, barangayCountGiven)
    console.log(output)
    if (!isAscending) {
        for (let i = 0; i < output.length; i++) {
            const barangay = output[i];
            toReturn.push(barangay.population);
        }
    } else {
        for (let i = output.length - 1; i > -1; i--) {
            const barangay = output[i];
            toReturn.push(barangay.population);
        }
    }
    console.log(toReturn)
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
    const res = await fetch('../res/data/test.json', { mode: 'no-cors' })

    const data = await res.json();
    return data;
}

async function getAllBarangayData() {
    const res = await fetch('../res/data/test.json', { mode: 'no-cors' })
    const masterData = await res.json();
    const data = masterData["barangays"];
    return data;
}

async function getBarangayData(location) {
    const res = await fetch('../res/data/test.json', { mode: 'no-cors' });

    const masterData = await res.json();
    const data = masterData["barangays"];
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == location) {
            return data[i]
        }
    }
}

async function getCityData() {
    const res = await fetch('../res/data/test.json', { mode: 'no-cors' });
    const data = await res.json();
    delete data["barangays"];
    return data;
}

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