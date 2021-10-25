const vaccinatedContainer1 = document.getElementById("vaccinated-container-1");
const vaccinatedContainer2 = document.getElementById("vaccinated-container-2");
const vaccinatedContainer3 = document.getElementById("vaccinated-container-3");

async function getData() {
   const res = await fetch('./output.json')
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

const data = await getData();
const totalNumberOfVaccinatedPeople = await getTotalNumberOfVaccinatedPeople(data);
const vaccinatedPeoplePercentage = await getVaccinatedPeoplePercentage(data);
const vaccinatedInPriorityGroupsPercentage = await getVaccinatedInPriorityGroupsPercentage(data);

vaccinatedContainer1.innerHTML = `
<h5> Total # of Fully Vaccinated
      Residents of Baguio City</h5>
<br>
<h2>
   ${totalNumberOfVaccinatedPeople}
</h2>`;
vaccinatedContainer2.innerHTML = `
<h5> Percentage of Vaccinated
      Residents of Baguio City
      </h5>
<br>
<h2>
   ${vaccinatedPeoplePercentage}%
</h2>`;
vaccinatedContainer3.innerHTML = `
<h5> Vaccinated Residents Percentage
      from Priority Groups (A1-A5)
      </h5>
<br>
<h2>
   ${vaccinatedInPriorityGroupsPercentage}%
</h2>`;


