// import { getBarangayNames, getBarangayVaccinatedData, getVaccineTypeData, getData } from './helper/jsonParser.js'


const barangayNames = await getBarangayNames()

let vaccinatedData = {}//All Barangays Vaccinated
let vaccineTypeData = {} //All Barangays Vaccine Type 
let vaccineTypeDataInPercent = {} // All Barangays Vaccine Type Percentage

const vaccineTypes = ["Astrazeneca", "Sputnik", "Pfizer", "Moderna", "Johnson & Johnson's Janssen", "Gamaleya", "Novavax", "Sinovac",]

for (var i = 0; i < 10; i++) {
   vaccinatedData[barangayNames[i]] = await getBarangayVaccinatedData(barangayNames[i]);

   vaccineTypeData[barangayNames[i]] = await getVaccineTypeData(barangayNames[i]);
}


function getPercentages(vaccineTypeData) {
   const output = {}
   for (var i = 0; i < Object.keys(vaccineTypeData).length; i++) {
      // Number of vaccinated in a barangay
      const barangayVaccinated = vaccinatedData[barangayNames[i]];
      // Vaccine Type data in barangay
      const barangayVaccineTypes = vaccineTypeData[barangayNames[i]]

      let vaccineTypePercentage = {}
      for (var j = 0; j < vaccineTypes.length; j++) {
         vaccineTypePercentage[vaccineTypes[j]] = (Number(barangayVaccineTypes[vaccineTypes[j]]) / barangayVaccinated) * 100
      }

      output[barangayNames[i]] = vaccineTypePercentage;
   }
   return output
}

const barColors = ["67B7DC", "8067DC", "DC67CE", "FF715B", "DCD267", "7DDC67", "67DCBB", "80B3F5"]
vaccineTypeDataInPercent = getPercentages(vaccineTypeData)
const vaccinePercentageMainContainer = document.querySelector(".vaccine-percentage-main-container")


async function displayPercentageGraphs() {
   for (let i = 0; i < Object.keys(vaccineTypeDataInPercent).length; i++) {
      // Data to be displayed
      const barangayVaccineTypeDataInPercent = vaccineTypeDataInPercent[barangayNames[i]]

      let barangayWithPercentContainer = document.createElement('div')
      barangayWithPercentContainer.classList.add('barangay-with-percentage-container')


      const barangayNameContainer = document.createElement('div');
      barangayNameContainer.classList.add('barangay-name')
      barangayNameContainer.innerHTML = `
         <span>${barangayNames[i]}</span>
      `;

      const allPercentContainer = document.createElement('div')
      allPercentContainer.classList.add('all-percent-container')
      allPercentContainer.style.width = '1000px'

      // allPercentContainer.style.setProperty("--currentWindowWidth", '1000')

      for (let j = 0; j < vaccineTypes.length; j++) {

         const vaccinePercent = barangayVaccineTypeDataInPercent[vaccineTypes[j]]

         const percentContainer = document.createElement('div')
         percentContainer.classList.add('percent-container')
         percentContainer.style.backgroundColor = `#${barColors[j]}`
         percentContainer.style.width = `${(vaccinePercent * 1000) / 100}px`

         console.log(barangayNames[i]);


         percentContainer.innerHTML = `
            <span class="percent-content" >
               ${Math.round(vaccinePercent * 100) / 100} %
            </span >
            `;

         allPercentContainer.appendChild(percentContainer)
      }

      barangayWithPercentContainer.append(barangayNameContainer)
      barangayWithPercentContainer.append(allPercentContainer)

      vaccinePercentageMainContainer.appendChild(barangayWithPercentContainer)
   }
}

const vaccineTypeLegendContainer = document.getElementById("vaccine-type-legend-container")

function displayVaccineTypeLegend() {
   for (let i = 0; i < vaccineTypes.length; i++) {
      const vaccineTypeSpan = document.createElement('span');
      vaccineTypeSpan.classList.add('vaccine-type-span')
      vaccineTypeSpan.style.setProperty("--backgroundColor", `#${barColors[i]}`)

      vaccineTypeSpan.innerHTML =
         `
      ${vaccineTypes[i]}
      `
      vaccineTypeLegendContainer.appendChild(vaccineTypeSpan)
   }
}

displayPercentageGraphs();
displayVaccineTypeLegend();

window.onresize = function (event) {
   for (let i = 0; i < Object.keys(vaccineTypeDataInPercent).length; i++) {
      for (let i = 0; i < vaccineTypes.length; i++) {
         percentContainer.querySelector()
      }

      percentContainer.style.width = `${(vaccinePercent * document.documentElement.clientWidth - 100) / 100}px`
      console.log(barangayNames[i]);
      console.log(true);
      console.log(window.getComputedStyle(percentContainer).getPropertyValue('width'));
   }
};