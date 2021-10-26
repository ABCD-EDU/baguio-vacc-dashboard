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
async function getMostVaccinatedBarangayNames(barangayCountGiven) {

}

async function getAllVaccinatedPerBarangay(isSorted) {

    const brgyData = await getAllBarangayData();
    const list = []

    for (let i = 0; i < brgyData.length; i++) {
        let output = {}

        const name = brgyData[i].name;
        const vaccinated = brgyData[i].vaccinated;
        
        output["name"] = name;
        output["vaccinated"] = vaccinated

        console.log(output);
        list.push(output);
    }

    const sortedList = []
    if (isSorted) {
        sortJSONByValue(list, 'vaccinated', true)
    };
    console.log(list);



}

function sortJSONByValue(list, prop, isAscending) {
    list.sort(function (a, b) {
        return a.vaccinated.localeCompare(b.vaccinated);
    });
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

async function getVaccineTypeData(location) {
    if (location === "Baguio City") {
        const data = await getCityData();
        return data.vaccineType;
    }

    const barangayData = await getBarangayData(location);
    return barangayData.vaccineType;
}

async function getAgeGroupData(location) {
    if (location === "Baguio City") {
        const data = await getCityData();
        return data.ageGroup;
    }

    const barangayData = await getBarangayData(location);
    return barangayData.ageGroup;
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
