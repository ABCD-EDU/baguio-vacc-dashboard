// import { getBarangayNames, getBarangayVaccinatedData, getVaccineTypeData, getData } from './helper/jsonParser.js'

const topNVaccinatedBarangays = await getTopNVaccinatedBarangays(10);

const barangayNames = []

for (let key in topNVaccinatedBarangays) {
   barangayNames.push(topNVaccinatedBarangays[key].name);
}
// console.log(barangayNames);

let vaccinatedData = {}//All Barangays Vaccinated
let vaccineTypeData = {} //All Barangays Vaccine Type 
let vaccineTypeDataInPercent = {} // All Barangays Vaccine Type Percentage


const vaccineTypes = ["Astrazeneca", "Sputnik", "Pfizer", "Moderna", "Johnson & Johnson's Janssen", "Gamaleya", "Novavax", "Sinovac",]
// for (var i = 0; i < barangayNames.length; i++) {
for (var i = 0; i < 10; i++) {
   vaccinatedData[barangayNames[i]] = await getBarangayVaccinatedData(barangayNames[i]);

   vaccineTypeData[barangayNames[i]] = await getVaccineTypeData(barangayNames[i]);
}

console.log(vaccinatedData);
console.log(vaccineTypeData);

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
      barangayWithPercentContainer.setAttribute('id', `barangay-with-percentage-container-${barangayNames[i]}`)


      const barangayNameContainer = document.createElement('div');
      barangayNameContainer.classList.add('barangay-name')
      barangayNameContainer.setAttribute('id', `barangay-name-container-${barangayNames[i]}`)
      barangayNameContainer.innerHTML = `
         <span> ${barangayNames[i]}</span >
      `;

      const allPercentContainer = document.createElement('div')
      allPercentContainer.classList.add('all-percent-container')
      allPercentContainer.setAttribute('id', `all-percent-container-${barangayNames[i]}`)
      allPercentContainer.style.maxWidth = '1200px'

      if (document.body.clientWidth < 763) {
         barangayNameContainer.style.width = '60%'

         barangayWithPercentContainer.style.width = '100%'
         barangayWithPercentContainer.style.flexDirection = 'column'
         barangayNameContainer.style.textAlign = 'left'
         barangayNameContainer.style.justifyContent = 'left'
         barangayNameContainer.style.width = '70%'

         // barangayWithPercentContainer.style.
         allPercentContainer.style.width = '97%'

      } else {
         barangayWithPercentContainer.style.flexDirection = 'row';
         barangayNameContainer.style.textAlign = 'right'
         barangayNameContainer.style.justifyContent = 'right'

         allPercentContainer.style.maxWidth = `${document.body.clientWidth - 200}px`;
         allPercentContainer.style.maxWidth = '1200px'
         allPercentContainer.style.width = '70%'
         allPercentContainer.style.paddingLeft = '0px'
      }

      for (let j = 0; j < vaccineTypes.length; j++) {

         const vaccinePercent = barangayVaccineTypeDataInPercent[vaccineTypes[j]]

         const percentContainer = document.createElement('div')
         percentContainer.classList.add('percent-container')
         percentContainer.setAttribute('id', `percent-container-${barangayNames[i]}-${vaccineTypes[j]}`)

         percentContainer.style.backgroundColor = `#${barColors[j]}`
         percentContainer.style.width = `${(vaccinePercent * 1000) / 100}px`
         // console.log(`${barangayNames[i]}-${percentContainer.style.width}`);

         percentContainer.innerHTML = `
         <span class="percent-content">
         ${Math.round(vaccinePercent * 100) / 100} %
            </span>
      `;
         const borderRadius = '5px'
         if (j == 0) {
            percentContainer.style.borderBottomLeftRadius = borderRadius
            percentContainer.style.borderTopLeftRadius = borderRadius
         }
         if (j == vaccineTypes.length - 1) {
            percentContainer.style.borderBottomRightRadius = borderRadius
            percentContainer.style.borderTopRightRadius = borderRadius
         }

         let toolTipContainer = document.createElement('span')
         toolTipContainer.classList.add('tooltip-container')
         toolTipContainer.setAttribute('id', `tooltip-container-${barangayNames[i]}-${vaccineTypes[j]}`)
         toolTipContainer.innerHTML = `
         ${vaccineTypes[j]} : ${Math.round(vaccinePercent * 100) / 100}% | ${vaccineTypeData[barangayNames[i]][vaccineTypes[j]]} Vaccinated
         `
         toolTipContainer.style.backgroundColor = `#${barColors[j]}`
         percentContainer.style.zIndex = '0';
         percentContainer.append(toolTipContainer)

         if (document.body.clientWidth < 763) {
            percentContainer.innerHTML = '';
            percentContainer.appendChild(toolTipContainer)
         }


         percentContainer.addEventListener("mouseover", function (e) {
            percentContainer.style.border = "1px solid #FFFFFF"
         })

         percentContainer.addEventListener("mouseout", function (e) {
            percentContainer.style.border = "none"
         })


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


window.addEventListener("resize", function () {


   for (let i = 0; i < Object.keys(vaccineTypeDataInPercent).length; i++) {
      //Get the bar that contains the barangay name and all the vaccine
      const barangayWithPercentContainer = document.getElementById(`barangay-with-percentage-container-${barangayNames[i]}`)

      //Get barangay name container 
      const barangayNameContainer = document.getElementById(`barangay-name-container-${barangayNames[i]}`)

      // Get container that contains all the percentage graph
      const allPercentContainer = document.getElementById(`all-percent-container-${barangayNames[i]}`);

      console.log(barangayNameContainer.style.textAlign);
      if (document.body.clientWidth < 763) {
         barangayWithPercentContainer.style.width = '100%'
         barangayWithPercentContainer.style.flexDirection = 'column'
         barangayNameContainer.style.textAlign = 'left'
         barangayNameContainer.style.justifyContent = 'left'
         barangayNameContainer.style.width = '70%'

         // barangayWithPercentContainer.style.
         allPercentContainer.style.width = '97%'

      } else {
         barangayWithPercentContainer.style.flexDirection = 'row';
         barangayNameContainer.style.textAlign = 'right'
         barangayNameContainer.style.justifyContent = 'right'

         allPercentContainer.style.maxWidth = `${document.body.clientWidth - 200}px`;
         allPercentContainer.style.maxWidth = '1200px'
         allPercentContainer.style.width = '70%'
         allPercentContainer.style.paddingLeft = '0px'
      }
      // Fetch the percentages of vaccines in a barangay
      const barangayVaccineTypeDataInPercent = vaccineTypeDataInPercent[barangayNames[i]]
      for (let j = 0; j < vaccineTypes.length; j++) {

         //Query the barangay-vaccine-type percent container using an ID assigned earlier
         const percentContainer = document.getElementById(`percent-container-${barangayNames[i]}-${vaccineTypes[j]}`)

         const toolTipContainer = document.getElementById(`tooltip-container-${barangayNames[i]}-${vaccineTypes[j]}`)



         // Get the percentage for a specific vaccine in a barangay
         const vaccinePercent = barangayVaccineTypeDataInPercent[vaccineTypes[j]]
         // Set width for barangay-vaccine-type percent container
         if (document.body.clientWidth < 763) {
            percentContainer.innerHTML = '';
            percentContainer.appendChild(toolTipContainer)
         } else {
            percentContainer.innerHTML = `
         <span class="percent-content">
         ${Math.round(vaccinePercent * 100) / 100} %
            </span>
      `;
            percentContainer.appendChild(toolTipContainer)
         }
         percentContainer.style.width = `${(vaccinePercent * document.documentElement.clientWidth - 100) / 100}px`
      }
   }
});

