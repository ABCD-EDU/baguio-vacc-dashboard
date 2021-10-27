/**
 * @author Fernandez
 * Prepares and sets the data for cards in the website that summarizes 
 * vaccination data of given JSON.
 */

const data = await getData();
const allBarangayData = await getAllBarangayData();

async function getTotalVaccinatedPopulation(data){
    const { vaccinated } = data;
    return ["", vaccinated];
}

async function getVaccinatedPriorityGroupsPercentage(data){
    let totalVaccinated = data.vaccinated;
    let categoriesTotal = data.category;
    let totalPrioGroups = null;
    for (let obj in categoriesTotal) {
        if (obj === "B&C")
            continue
        totalPrioGroups += parseInt(categoriesTotal[obj]);
    }
    let percentage = ( totalPrioGroups / totalVaccinated ) * 100;
    // var totalVaccinated = await getTotalVaccinatedPopulation(data);
    // var totalVaccinatedInt = parseInt(totalVaccinated[1]);
    // const { A1, A2, A3, A4, A5 } = data.category;
    // var sumVaccinatedPrioGroups = parseInt(A1) + parseInt(A2) + parseInt(A3) + parseInt(A4) + parseInt(A5);
    // var vaccinatedPrioGroupPercentage = Math.round((sumVaccinatedPrioGroups/totalVaccinatedInt)*100);
    return ["", Math.round(percentage) + "%"];
}

async function getMostVaccinatedPriorityGroup(data){
    var mostVaccinatedPrioGroup = "";
    var totalMostVaccinatedPrioGroup = 0;
    var totalVaccinated = await getTotalVaccinatedPopulation(data);
    var totaVaccinatedInt = parseInt(totalVaccinated[1]);
    const { A1, A2, A3, A4, A5 } = data.category;
    var vaccinatedPrioGroupArray = [parseInt(A1), parseInt(A2), parseInt(A3), parseInt(A4), parseInt(A5)];
    var prioGroups = ["A1", "A2", "A3", "A4", "A5"];
    for(let i = 0; i < vaccinatedPrioGroupArray.length; i++){
        if(vaccinatedPrioGroupArray[i] > totalMostVaccinatedPrioGroup){
            mostVaccinatedPrioGroup = prioGroups[i];
            totalMostVaccinatedPrioGroup = vaccinatedPrioGroupArray[i];
        }
    }
    var mostVaccinatedPrioGroupPercentage = Math.round((totalMostVaccinatedPrioGroup/totaVaccinatedInt)*100)
    return [mostVaccinatedPrioGroup, mostVaccinatedPrioGroupPercentage + "%"];
}

async function getMostVaccinatedBarangay(allBarangayData){
    var mostVaccinatedBarangay = "";
    var mostVaccinatedPercentage = 0;
    
    allBarangayData.forEach(barangay => {
        const { name, population, vaccinated } = barangay;
        var vaccinatedPercentage = (parseInt(vaccinated)/parseInt(population))*100; 
        if(vaccinatedPercentage > mostVaccinatedPercentage){
            mostVaccinatedBarangay = name;
            mostVaccinatedPercentage = vaccinatedPercentage;
        }
    })
    return [mostVaccinatedBarangay, mostVaccinatedPercentage + "%"];
}

async function displayTotals(id, barangayAndPercentage){
    var barangay = barangayAndPercentage[0];
    var stat = barangayAndPercentage[1];
    const targetId = document.getElementById(id);
    const desc = document.createElement("h2");
    if(barangay == ""){
        desc.innerHTML = `${stat}`;
    } else {
        desc.innerHTML = `${barangay} - ${stat}`
    }
    targetId.appendChild(desc);
}

displayTotals("total-card1", await getTotalVaccinatedPopulation(data));
displayTotals("total-card2", await getVaccinatedPriorityGroupsPercentage(data));
displayTotals("total-card3", await getMostVaccinatedPriorityGroup(data));
displayTotals("total-card4", await getMostVaccinatedBarangay(allBarangayData));