/**
@author Arian Carl A. Cayton

This code is responsible in displaying the rainbow graph which contains
 the percentages of each of the vaccines in the data. The distribution or percentage of the
 bars color is determined by the count of the vaccine type used relative to the 
 total vaccinated individuals. 
*/

/*Only the top 10 most vaccinated barangays will be displayed so a method
that fetches the mentioned data is created on the helper script
*/
const topNVaccinatedBarangays = await getTopNVaccinatedBarangays(10);

/*The method has a locally word in it because it is created in this script 
and not on the helper and it's job is to return the names of the barangay
from the variable made above. 
*/
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

/* The colors to be used for the rainbow graph
*/
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
/* The vaccine types similar to contents of the data
*/
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

/*Variables declared earlier are populated with the objects to be used on the latter part of the file
*/
for (var i = 0; i < 10; i++) {
   const barangayNames = getBarangayNamesLocally();
   vaccinatedData[barangayNames[i]] = await getBarangayVaccinatedData(
      barangayNames[i]
   );

   vaccineTypeData[barangayNames[i]] = await getVaccineTypeData(
      barangayNames[i]
   );
}

/** 
 * Get the percentages of the vaccine types relative to the vaccinated population
 * @param vaccineTypeData contains all the barangays with their respective
 * vaccine type data
*/
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
         //Round-off to two decimal places
         vaccineTypePercentage[vaccineTypes[j]] =
            (Number(barangayVaccineTypes[vaccineTypes[j]]) / barangayVaccinated) *
            100;
      }
      /*
      output example:
      "Bakakeng":{
         "Astrazeneca": "5902",
         "Sputnik": "1643",
         "Pfizer": "4374",
          ....
      }
      */
      output[barangayNames[i]] = vaccineTypePercentage;
   }
   return output;
}

vaccineTypeDataInPercent = getPercentages(vaccineTypeData);

//Retrieve main container of the graph
const vaccinePercentageMainContainer = document.querySelector(
   ".vaccine-percentage-main-container"
);

/**   This will display the graph depending on the selected content.
* Whether it be the percentage or the count of the vaccine type used
* @param id the id of the button clicked. It's either
* percentageButton-perPercent or vaccinatedButton-perPercent
*/
function displayPerPercentageGraph(id) {
   let isPercentage = false;
   if (id === "percentageButton-perPercent") {
      isPercentage = true;
   } else {
      isPercentage = false;
   }

   const barangayNames = getBarangayNamesLocally();

   // Will set the default structure and look of the graph on website load/reload
   for (let i = 0; i < Object.keys(vaccineTypeDataInPercent).length; i++) {
      const barangayVaccineTypeData = vaccineTypeData[barangayNames[i]]
      const barangayVaccineTypeDataInPercent =
         vaccineTypeDataInPercent[barangayNames[i]];

      //Create an element and set the contents
      let barangayWithPercentContainer = document.createElement("div");
      setBarangayWithPercentContainerContent(barangayWithPercentContainer, i);

      const barangayNameContainer = document.createElement("div");
      setBarangayNameContainerContent(barangayNameContainer, i);

      const allPercentContainer = document.createElement("div");
      setAllPercentContainerContent(allPercentContainer, i);

      setBarangayWithPercentContainerStyle(barangayWithPercentContainer);
      setBarangayNameContainerStyle(barangayNameContainer);
      setAllPercentContainerStyle(allPercentContainer);

      // loop through all the vaccine types 
      for (let j = 0; j < vaccineTypes.length; j++) {
         const vaccinatedByVaccineType = barangayVaccineTypeData[vaccineTypes[j]]
         const vaccinePercent = barangayVaccineTypeDataInPercent[vaccineTypes[j]];

         const percentContainer = document.createElement("div");
         // Pass the parameters needed
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

/**
 * The following methods (setXXXXContainerContent) have similar description in which
 * they set the contents of the container and assign class
 * or id to the container and more. 
 * 
 * 
 * Similarly, the methods (setXXXXContainerStyle) does the same job
 * but only for styling the container
 */


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
      barangayWithPercentContainer.style.width = "100%";
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
      barangayNameContainer.style.width = "30%";
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
//Change display format when window is resized
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

      const barangayVaccineTypeData = vaccineTypeData[barangayNames[i]]
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
         const vaccinatedByVaccineType = barangayVaccineTypeData[vaccineTypes[j]]
         const vaccinePercent = barangayVaccineTypeDataInPercent[vaccineTypes[j]];
         let isPercentage = true;
         // Set width for barangay-vaccine-type percent container
         setPercentContainerContent(percentContainer,
            i,
            j,
            vaccineTypes,
            barColors,
            vaccinePercent,
            vaccinatedByVaccineType,
            isPercentage)

         // if (document.body.clientWidth < 763) {
         //    percentContainer.innerHTML = "";
         // } else {
         //    percentContainer.innerHTML = `
         //    <span class="percent-content" >
         //       ${Math.round(vaccinePercent * 100) / 100} %
         //       </ span>
         //    `;
         // }
         // percentContainer.style.zIndex = "0";
         percentContainer.appendChild(toolTipContainer);
         // percentContainer.style.width = `${(vaccinePercent * document.documentElement.clientWidth - 100) / 100
         //    }px`;
      }
   }
});


// Add listeners to the buttons
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