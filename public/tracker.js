initializeBarangaySelector();

async function initializeBarangaySelector() {
    let barangays = await getBarangayNames();
    let selector = document.getElementById("barangaySelector");
    for (let i = 0; i < barangays.length; i++) {
        let opt = document.createElement('option');
        opt.value = barangays[i];
        opt.innerHTML = barangays[i];
        selector.appendChild(opt);
    }
    onBarangayChange();
}


async function onBarangayChange() {
    let barangay = document.getElementById("barangaySelector").value;
    let data = await getBarangayData(barangay);
    data = data["category"];

    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        let category = keys[i];
        document.getElementById(category + "-Data").textContent=data[category];
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
        var max = getMaxBarangayVaccine(data);
        console.log(max)
        const leftContainer = document.createElement("div");
        leftContainer.id = "leftContainer"
        const rightContainer = document.createElement("div");
        rightContainer.id = "rightContainer"

        leftContainer.style.width = "300px";

        brgyContainer.appendChild(leftContainer);
        brgyContainer.appendChild(rightContainer);
        for (let [key, value] of Object.entries(data)) {
            leftContainer.innerHTML += `<span id=\"vaccine${count}\">${key}</span>`
            rightContainer.innerHTML += `<div id=\"bar${count}\">${value}</div>`

            const BASE_WIDTH = 1150;
            const NEW_WIDTH = (value / max) * BASE_WIDTH;

            document.getElementById(`bar${count}`).style.backgroundColor = "#FFD57B";
            document.getElementById(`bar${count}`).style.width = `${NEW_WIDTH}px`;
            document.getElementById(`bar${count}`).style.display = "flex";
            document.getElementById(`bar${count}`).style.justifyContent = "center";
            document.getElementById(`bar${count}`).style.alignItems = "center";
            document.getElementById(`bar${count}`).style.margin = "0.5rem";
            document.getElementById(`bar${count}`).style.borderRadius = "5px";
            document.getElementById(`bar${count}`).style.height = "35px";

            document.getElementById(`vaccine${count}`).style.display = "block";
            document.getElementById(`vaccine${count}`).style.paddingTop = "0.8rem";
            document.getElementById(`vaccine${count}`).style.paddingBottom = "0.45rem";
            document.getElementById(`vaccine${count}`).style.fontFamily = "Roboto";
            document.getElementById(`vaccine${count}`).style.fontSize = "20px";
            count++;
        }
    })
    .catch(err => {
        console.log(err);
    })
