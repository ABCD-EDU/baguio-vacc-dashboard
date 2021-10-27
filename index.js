async function getData(){
   const res = await fetch('./res/data/baguio-city.json');
   const data = await res.json();
   return data;
}

async function getTotalVaccinatedPopulation(){
   const { vaccinated } = data;
    return [parseInt(vaccinated)];
}

async function getVaccinatedPopulationPercentage(data){
   const { population, vaccinated } = data;
   var vaccinatedPercentage = Math.round((parseInt(vaccinated)/parseInt(population))*100);
   return [vaccinatedPercentage + "%"];
}

async function getVaccinatedPriorityGroupsPercentage(data){
   var totalVaccinated = await getTotalVaccinatedPopulation(data);
    const { A1, A2, A3, A4, A5 } = data.category;
    var sumVaccinatedPrioGroups = parseInt(A1) + parseInt(A2) + parseInt(A3) + parseInt(A4) + parseInt(A5);
    var vaccinatedPrioGroupPercentage = Math.round((sumVaccinatedPrioGroups/totalVaccinated)*100);
    return [vaccinatedPrioGroupPercentage + "%"];
}

async function displayTotals(id, stat){
   const targetId = document.getElementById(id);
   const desc = document.createElement("h2");
   desc.innerHTML = `${stat}`;
   targetId.appendChild(desc);
}
const data = await getData();
displayTotals("vaccinated-container-1", await getTotalVaccinatedPopulation(data));
displayTotals("vaccinated-container-2", await getVaccinatedPopulationPercentage(data));
displayTotals("vaccinated-container-3", await getVaccinatedPriorityGroupsPercentage(data));