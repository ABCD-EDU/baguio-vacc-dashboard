
async function getVaccineTypeData() {
   const res = await fetch('../res/data/output.json');

   const data = await res.json();
   const barangayVaccineTypeData = data.map(data_values => data_values.vaccineType);
   return barangayVaccineTypeData;
}

async function getVaccineTypeCounts() {
   const data = await getVaccineTypeData();
   let output = data[0]
   // console.log(data[0]);
   console.log(output);
   data.forEach(element => {
      objs = Object.keys(element)
      console.log(objs);

   });

}

getVaccineTypeCounts();

window.onload = function () {
   var chart = new CanvasJS.Chart("chartContainer", {

      exportFileName: "Doughnut Chart",
      exportEnabled: true,
      animationEnabled: true,
      title: {
         text: "Monthly Expense"
      },
      legend: {
         cursor: "pointer",
      },
      data: [{
         type: "doughnut",
         innerRadius: 90,
         showInLegend: true,
         toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
         indexLabel: "{name} - #percent%",
         dataPoints: [{
            y: 450,
            name: "Food"
         },
         {
            y: 120,
            name: "Insurance"
         },
         {
            y: 300,
            name: "Travelling"
         },
         {
            y: 800,
            name: "Housing"
         },
         {
            y: 150,
            name: "Education"
         },
         {
            y: 150,
            name: "Shopping"
         },
         {
            y: 250,
            name: "Others"
         }
         ]
      }]
   });
   chart.render();
}