const totalCard1 = document.getElementById("total-card1");
const totalCard2 = document.getElementById("total-card2");
const totalCard3 = document.getElementById("total-card3");
const totalCard4 = document.getElementById("total-card4");

async function getData() {
    const res = await fetch('../output.json')
    const data = await res.json();
    return data;
}

async function getTotalNumberOfVaccinatedPeople() {
    var totalVaccinated = 0;
    data.forEach((barangay) => {
       const { vaccinated } = barangay;
       var vaccinatedToInt = parseInt(vaccinated);
       totalVaccinated += vaccinatedToInt;
    })
    return totalVaccinated;
 }
 
 async function getTotalPopulation(data) {
    var totalPopulation = 0;
    data.forEach((barangay) => {
       const { population } = barangay;
       var populationToInt = parseInt(population);
       totalPopulation += populationToInt;
    })
    return totalPopulation;
 }
 
 async function getVaccinatedPeoplePercentage(data) {
    var totalVaccinated = await getTotalNumberOfVaccinatedPeople(data);
    var totalPopulation = await getTotalPopulation(data);
    var vaccinatedPercentage = Math.round((totalVaccinated / totalPopulation) * 100);
 
    return vaccinatedPercentage;
 }
 
 async function getVaccinatedInPriorityGroupsPercentage(data) {
    var totalVaccinatedInPriorityGroups = 0;
    var totalVaccinatedPopulation = await getTotalNumberOfVaccinatedPeople(data);
    data.forEach(barangay => {
       const { A1, A2, A3, A4, A5 } = barangay.category;
       var a1ToInt = parseInt(A1);
       var a2ToInt = parseInt(A2);
       var a3ToInt = parseInt(A3);
       var a4ToInt = parseInt(A4);
       var a5ToInt = parseInt(A5);
       var sumOfVaccinatedPriorityGroups = a1ToInt + a2ToInt + a3ToInt + a4ToInt + a5ToInt;
       totalVaccinatedInPriorityGroups = totalVaccinatedInPriorityGroups + sumOfVaccinatedPriorityGroups;
    })
    var vaccinatedInPriorityGroupsPercentage = Math.round((totalVaccinatedInPriorityGroups / totalVaccinatedPopulation) * 100);
    
    return vaccinatedInPriorityGroupsPercentage;
 }

 async function getTopVaccinatedBarangay(data){
    var topBarangayName = "";
    var topVaccinatedPercentage = 0;
    data.forEach(barangay => {
       const { name, population, vaccinated } = barangay;
       var vaccinatedToInt = parseInt(vaccinated);
       var populationToInt = parseInt(population);
       var vaccinatedPercentage = (vaccinatedToInt/populationToInt)*100;
       if(vaccinatedPercentage > topVaccinatedPercentage) {
          topVaccinatedPercentage = vaccinatedPercentage;
          topBarangayName = name;
       }
    })
    return [topBarangayName, topVaccinatedPercentage];
 }
 
 async function getTopVaccinatedGroup(data){
    var totalA1 = 0;
    var totalA2 = 0;
    var totalA3 = 0;
    var totalA4 = 0;
    var totalA5 = 0;
    var totalBC = 0;
    var topVaccinatedGroup = "";
    var topVaccinatedGroupPercentage = 0;
    var totalVaccinatedPeople = await getTotalNumberOfVaccinatedPeople(data);
    //get the total vaccinated people from different groups
    data.forEach(barangay => {
       const { A1, A2, A3, A4, A5, 'B&C':BC } = barangay.category;
       var a1ToInt = parseInt(A1);
       var a2ToInt = parseInt(A2);
       var a3ToInt = parseInt(A3);
       var a4ToInt = parseInt(A4);
       var a5ToInt = parseInt(A5);
       var bcToInt = parseInt(BC);
       totalA1 = totalA1 + a1ToInt;
       totalA2 = totalA2 + a2ToInt;
       totalA3 = totalA3 + a3ToInt;
       totalA4 = totalA4 + a4ToInt;
       totalA5 = totalA5 + a5ToInt;
       totalBC = totalBC + bcToInt;
    })
    //get the percentages of groups
    var a1Percentage = (totalA1/totalVaccinatedPeople)*100;
    var a2Percentage = (totalA2/totalVaccinatedPeople)*100;
    var a3Percentage = (totalA3/totalVaccinatedPeople)*100;
    var a4Percentage = (totalA4/totalVaccinatedPeople)*100;
    var a5Percentage = (totalA5/totalVaccinatedPeople)*100;
    var bcPercentage = (totalBC/totalVaccinatedPeople)*100;
 
    //get the highest percentage and group
    var percentageArray = [a1Percentage, a2Percentage, a3Percentage, a4Percentage, a5Percentage, bcPercentage];
    var groups = ["A1", "A2", "A3", "A4", "A5", "B&C"];
    for(let i = 0; i < percentageArray.length; i++) {
       if(percentageArray[i] > topVaccinatedGroupPercentage){
          topVaccinatedGroupPercentage = percentageArray[i];
          topVaccinatedGroup = groups[i];
       }
    }
 
    return [topVaccinatedGroup, Math.round(topVaccinatedGroupPercentage)];
 } 

const data = await getData();
const totalNumberOfVaccinatedPeople = await getTotalNumberOfVaccinatedPeople(data);
const vaccinatedPeoplePercentage = await getVaccinatedPeoplePercentage(data);
const vaccinatedInPriorityGroupsPercentage = await getVaccinatedInPriorityGroupsPercentage(data);
const topVaccinatedBarangay = await getTopVaccinatedBarangay(data);
const topVaccinatedGroup = await getTopVaccinatedGroup(data);

totalCard1.innerHTML = `
<h5> Total Vaccinated Individuals <br>(Baguio City)</h5>
    <br>
    <h2>
    ${totalNumberOfVaccinatedPeople}
    </h2>`;
totalCard2.innerHTML = `
<h5> % of Vaccinated Residents from Priority Groups (A1 - A5) </h5>
    <br>
    <h2>
    ${vaccinatedInPriorityGroupsPercentage}
    </h2>`;
totalCard3.innerHTML = `
<h5> Most Vaccinated Priority Group <br>(A1 - A5) </h5>
    <br>
    <h2>
    ${topVaccinatedGroup[0]} - ${topVaccinatedGroup[1]}%
    </h2>`;
totalCard4.innerHTML = `
<h5> Barangay with the most vaccinated residents </h5>
    <br>
    <h2>
    ${topVaccinatedBarangay[0]} at ${topVaccinatedBarangay[1]}%
    </h2>`;


var vaccineValues = []

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

initializeBarangaySelector();

async function onBarangayChange() {
    const barangay = document.getElementById("barangaySelector").value;
    let data = null;
    if (barangay === "Baguio City") {
        data = await getCityData();
    }else {
        data = await getBarangayData(barangay);
    }
    data = data["category"];

    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        let category = keys[i];
        document.getElementById(category + "-Data").textContent = data[category];
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
