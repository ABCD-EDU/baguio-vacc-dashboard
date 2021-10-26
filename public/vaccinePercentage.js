// import { getBarangayNames, getBarangayVaccinatedData, getVaccineTypeData, getData } from './helper/jsonParser.js'

const topNVaccinatedBarangays = await getTopNVaccinatedBarangays(10);

function getBarangayNamesLocally() {
   const barangayNames = [];
   for (let key in topNVaccinatedBarangays) {
      barangayNames.push(topNVaccinatedBarangays[key].name);
   }
   return barangayNames;
}

let vaccinatedData = {}; //All Barangays Vaccinated
let vaccineTypeData = {}; //All Barangays Vaccine Type
let vaccineTypeDataInPercent = {}; // All Barangays Vaccine Type Percentage

const barColors = [
   "67B7DC",
   "8067DC",
   "DC67CE",
   "FF715B",
   "DCD267",
   "7DDC67",
   "67DCBB",
   "80B3F5",
];
const vaccineTypes = [
   "Astrazeneca",
   "Sputnik",
   "Pfizer",
   "Moderna",
   "Johnson & Johnson's Janssen",
   "Gamaleya",
   "Novavax",
   "Sinovac",
];

for (var i = 0; i < 10; i++) {
   const barangayNames = getBarangayNamesLocally();
   vaccinatedData[barangayNames[i]] = await getBarangayVaccinatedData(
      barangayNames[i]
   );

   vaccineTypeData[barangayNames[i]] = await getVaccineTypeData(
      barangayNames[i]
   );
}


function getPercentages(vaccineTypeData) {
   const barangayNames = getBarangayNamesLocally();
   const output = {};
   for (var i = 0; i < Object.keys(vaccineTypeData).length; i++) {
      // Number of vaccinated in a barangay
      const barangayVaccinated = vaccinatedData[barangayNames[i]];
      // Vaccine Type data in barangay
      const barangayVaccineTypes = vaccineTypeData[barangayNames[i]];

      let vaccineTypePercentage = {};
      for (var j = 0; j < vaccineTypes.length; j++) {
         vaccineTypePercentage[vaccineTypes[j]] =
            (Number(barangayVaccineTypes[vaccineTypes[j]]) / barangayVaccinated) *
            100;
      }

      output[barangayNames[i]] = vaccineTypePercentage;
   }
   return output;
}

vaccineTypeDataInPercent = getPercentages(vaccineTypeData);
const vaccinePercentageMainContainer = document.querySelector(
   ".vaccine-percentage-main-container"
);

function displayPerPercentageGraph(id) {
   let isPercentage = false;
   if (id === "percentageButton-perPercent") {
      isPercentage = true;
   } else {
      isPercentage = false;
   }


   const barangayNames = getBarangayNamesLocally();
   for (let i = 0; i < Object.keys(vaccineTypeDataInPercent).length; i++) {
      // Data to be displayed
      const barangayVaccineTypeData = vaccineTypeData[barangayNames[i]]
      const barangayVaccineTypeDataInPercent =
         vaccineTypeDataInPercent[barangayNames[i]];

      let barangayWithPercentContainer = document.createElement("div");
      setBarangayWithPercentContainerContent(barangayWithPercentContainer, i);

      const barangayNameContainer = document.createElement("div");
      setBarangayNameContainerContent(barangayNameContainer, i);

      const allPercentContainer = document.createElement("div");
      setAllPercentContainerContent(allPercentContainer, i);

      setBarangayWithPercentContainerStyle(barangayWithPercentContainer);
      setBarangayNameContainerStyle(barangayNameContainer);
      setAllPercentContainerStyle(allPercentContainer);


      for (let j = 0; j < vaccineTypes.length; j++) {
         const vaccinatedByVaccineType = barangayVaccineTypeData[vaccineTypes[j]]
         const vaccinePercent = barangayVaccineTypeDataInPercent[vaccineTypes[j]];

         const percentContainer = document.createElement("div");

         setPercentContainerContent(
            percentContainer,
            i,
            j,
            vaccineTypes,
            barColors,
            vaccinePercent,
            vaccinatedByVaccineType,
            isPercentage
         );

         let toolTipContainer = document.createElement("span");
         toolTipContainer.classList.add("tooltip-container");
         toolTipContainer.setAttribute(
            "id",
            `tooltip-container-${barangayNames[i]}-${vaccineTypes[j]}`
         );
         toolTipContainer.innerHTML = `
         ${vaccineTypes[j]} : ${Math.round(vaccinePercent * 100) / 100}% | ${vaccineTypeData[barangayNames[i]][vaccineTypes[j]]
            } Vaccinated
         `;
         toolTipContainer.style.backgroundColor = `#${barColors[j]}`;

         percentContainer.append(toolTipContainer);

         allPercentContainer.appendChild(percentContainer);
      }

      barangayWithPercentContainer.append(barangayNameContainer);
      barangayWithPercentContainer.append(allPercentContainer);

      vaccinePercentageMainContainer.appendChild(barangayWithPercentContainer);
   }
}

const vaccineTypeLegendContainer = document.getElementById(
   "vaccine-type-legend-container"
);

function displayVaccineTypeLegend() {
   for (let i = 0; i < vaccineTypes.length; i++) {
      const vaccineTypeSpan = document.createElement("span");
      vaccineTypeSpan.classList.add("vaccine-type-span");
      vaccineTypeSpan.style.setProperty("--backgroundColor", `#${barColors[i]}`);
      vaccineTypeSpan.innerHTML = `
      ${vaccineTypes[i]}
   `;
      vaccineTypeLegendContainer.appendChild(vaccineTypeSpan);
   }
}

const barangayNames = getBarangayNamesLocally();

function setBarangayWithPercentContainerContent(
   barangayWithPercentContainer,
   indexI
) {
   barangayWithPercentContainer.classList.add(
      "barangay-with-percentage-container"
   );
   barangayWithPercentContainer.setAttribute(
      "id",
      `barangay-with-percentage-container-${barangayNames[indexI]}`
   );
}

function setBarangayWithPercentContainerStyle(barangayWithPercentContainer) {
   if (document.body.clientWidth < 763) {
      barangayWithPercentContainer.style.width = "100%";
      barangayWithPercentContainer.style.flexDirection = "column";
   } else {
      barangayWithPercentContainer.style.flexDirection = "row";
   }
}

function setBarangayNameContainerContent(barangayNameContainer, indexI) {
   barangayNameContainer.classList.add("barangay-name");
   barangayNameContainer.setAttribute(
      "id",
      `barangay-name-container-${barangayNames[indexI]}`
   );
   barangayNameContainer.innerHTML = `
         <span> ${barangayNames[indexI]}</span >
      `;
}

function setBarangayNameContainerStyle(barangayNameContainer) {
   if (document.body.clientWidth < 763) {
      barangayNameContainer.style.textAlign = "left";
      barangayNameContainer.style.justifyContent = "left";
      barangayNameContainer.style.width = "70%";
   } else {
      barangayNameContainer.style.textAlign = "right";
      barangayNameContainer.style.justifyContent = "right";
   }
}

function setAllPercentContainerContent(allPercentContainer, indexI) {
   allPercentContainer.classList.add("all-percent-container");
   allPercentContainer.setAttribute(
      "id",
      `all-percent-container-${barangayNames[indexI]}`
   );
   allPercentContainer.style.maxWidth = "1200px";
}

function setAllPercentContainerStyle(allPercentContainer) {
   if (document.body.clientWidth < 763) {
      allPercentContainer.style.width = "97%";
   } else {
      allPercentContainer.style.maxWidth = `${document.body.clientWidth - 200}px`;
      allPercentContainer.style.maxWidth = "1200px";
      allPercentContainer.style.width = "80%";
      allPercentContainer.style.paddingLeft = "0px";
   }
}

function setPercentContainerContent(
   percentContainer,
   i,
   j,
   vaccineTypes,
   barColors,
   vaccinePercent,
   vaccinatedByVaccineType,
   isPercentage
) {
   percentContainer.classList.add("percent-container");
   percentContainer.setAttribute(
      "id",
      `percent-container-${barangayNames[i]}-${vaccineTypes[j]}`
   );

   percentContainer.style.backgroundColor = `#${barColors[j]}`;
   percentContainer.style.width = `${(vaccinePercent * 1000) / 100}px`;


   if (document.body.clientWidth < 763) {
      percentContainer.innerHTML = ``
   } else {
      if (isPercentage) {
         percentContainer.innerHTML = `
         <span class="percent-content" >
            ${Math.round(vaccinePercent * 100) / 100} %
            </span >
         `;
      } else {
         percentContainer.innerHTML = `
         <span class="percent-content" >
            ${vaccinatedByVaccineType}
            </span >
         `;
      }

   }
   const borderRadius = "5px";
   if (j == 0) {
      percentContainer.style.borderBottomLeftRadius = borderRadius;
      percentContainer.style.borderTopLeftRadius = borderRadius;
   }
   if (j == vaccineTypes.length - 1) {
      percentContainer.style.borderBottomRightRadius = borderRadius;
      percentContainer.style.borderTopRightRadius = borderRadius;
   }

   percentContainer.addEventListener("mouseover", function (e) {
      percentContainer.style.border = "1px solid #FFFFFF";
   });

   percentContainer.addEventListener("mouseout", function (e) {
      percentContainer.style.border = "none";
   });
}

function setPercentContainerStyle(percentContainer) {
   percentContainer.style.zIndex = "0";
   if (document.body.clientWidth < 763) {
      percentContainer.innerHTML = ``;
   } else {
      percentContainer.innerHTML = `
         <span class="percent-content" >
            ${Math.round(vaccinePercent * 100) / 100} %
            </span >
         `;
   }
}

function setTooltipContainerContainerStyle(
   tooltipContainer,
   i,
   j,
   vaccineTypes,
   barColors,
   vaccinePercent
) { }

function setTooltipContainerContainerContent(toolTipContainer) { }


displayVaccineTypeLegend();

window.addEventListener("resize", function () {
   const barangayNames = getBarangayNamesLocally();

   for (let i = 0; i < Object.keys(vaccineTypeDataInPercent).length; i++) {
      //Get the bar that contains the barangay name and all the vaccine
      const barangayWithPercentContainer = document.getElementById(
         `barangay-with-percentage-container-${barangayNames[i]}`
      );
      //Get barangay name container
      const barangayNameContainer = document.getElementById(
         `barangay-name-container-${barangayNames[i]}`
      );
      // Get container that contains all the percentage graph
      const allPercentContainer = document.getElementById(
         `all-percent-container-${barangayNames[i]}`
      );

      setBarangayWithPercentContainerStyle(barangayWithPercentContainer);
      setBarangayNameContainerStyle(barangayNameContainer);
      setAllPercentContainerStyle(allPercentContainer);

      const barangayVaccineTypeDataInPercent =
         vaccineTypeDataInPercent[barangayNames[i]];
      for (let j = 0; j < vaccineTypes.length; j++) {
         //Query the barangay-vaccine-type percent container using an ID assigned earlier
         const percentContainer = document.getElementById(
            `percent-container-${barangayNames[i]}-${vaccineTypes[j]}`
         );

         const toolTipContainer = document.getElementById(
            `tooltip-container-${barangayNames[i]}-${vaccineTypes[j]}`
         );

         // Get the percentage for a specific vaccine in a barangay
         const vaccinePercent = barangayVaccineTypeDataInPercent[vaccineTypes[j]];

         // Set width for barangay-vaccine-type percent container
         if (document.body.clientWidth < 763) {
            percentContainer.innerHTML = "";
            percentContainer.appendChild(toolTipContainer);
         } else {
            percentContainer.innerHTML = `
         <pan class="percent-content" >
            ${Math.round(vaccinePercent * 100) / 100} %
            </ span>
         `;
            percentContainer.appendChild(toolTipContainer);
         }
         percentContainer.style.width = `${(vaccinePercent * document.documentElement.clientWidth - 100) / 100
            }px`;
      }
   }
});



const percentButtonId = "percentageButton-perPercent";
const percentButton = document.getElementById(percentButtonId)
percentButton.addEventListener("click",
   function () {
      const vaccinePercentageMainContainer = document.querySelector(
         ".vaccine-percentage-main-container"
      );
      vaccinePercentageMainContainer.innerHTML = ''
      displayPerPercentageGraph(percentButtonId);
   })

const vaccinatedButtonId = "vaccinatedButton-perPercent"
document.getElementById(vaccinatedButtonId).addEventListener("click",
   function () {
      const vaccinePercentageMainContainer = document.querySelector(
         ".vaccine-percentage-main-container"
      );
      vaccinePercentageMainContainer.innerHTML = ''
      displayPerPercentageGraph(vaccinatedButtonId);
   })

displayPerPercentageGraph("percentageButton-perPercent");