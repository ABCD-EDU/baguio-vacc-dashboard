async function getBarangayNames() {
    const res = await fetch('../res/data/output.json')

    const data = await res.json();
    let names = []
    for (var i = 0; i < data.length; i++) {
        names.push(data[i].name)
    }
    return names
}

async function getData() {
    const res = await fetch('../res/data/output.json')

    const data = await res.json();
    return data;
}

async function getBarangayData(location) {
    const res = await fetch('../res/data/output.json');

    const data = await res.json();
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == location) {
            return data[i]
        }
    }
}

async function getVaccineTypeData(location) {
    const barangayData = await getBarangayData(location);
    return barangayData.vaccineType;
}

async function getAgeGroupData(location) {
    const barangayData = await getBarangayData(location);
    return barangayData.AgeGroup;
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
