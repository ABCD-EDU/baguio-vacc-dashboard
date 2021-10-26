async function getBarangayNames() {
    const res = await fetch('../res/data/test.json')

    const masterData = await res.json();
    const data = masterData["barangays"];
    let names = []
    for (var i = 0; i < data.length; i++) {
        names.push(data[i].name)
    }
    return names
}

async function getData() {
    const res = await fetch('../res/data/test.json')

    const data = await res.json();
    return data;
}

async function getAllBarangayData() {
    const res = await fetch('../res/data/test.json')
    const masterData = await res.json();
    const data = masterData["barangays"];
    return data;
}

async function getBarangayData(location) {
    const res = await fetch('../res/data/test.json');

    const masterData = await res.json();
    const data = masterData["barangays"];
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == location) {
            return data[i]
        }
    }
}

async function getCityData() {
    const res = await fetch('../res/data/test.json');
    const data = await res.json();
    delete data["barangays"];
    return data;
}

async function getVaccineTypeData(location, isAscending) {
    let data = null;
    if (location === "Baguio City") {
        data = await getCityData();
    }else {
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

    // getVaccineTypeData(location)
    // .then(data => {

    // })
    // .catch(err => {
    //     console.log(err)
    // })

}

function sortAccordingToKeys(object, isAscending) {
    let sortable = [];
    for (let obj in object) {
        sortable.push([obj, object[obj]]);
    }
    if (isAscending) {
        sortable.sort(function(a, b) {
            return a[1] - b[1];
        })
    }else {
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