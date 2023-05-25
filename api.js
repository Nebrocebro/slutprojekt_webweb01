let searchText = document.getElementById("txtSearch");
let resultsContainer = document.getElementById("resultsContainer");

searchText.onkeydown = async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let searchTerm = searchText.value;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "7239be9641msh79f3ed62a48ec68p18bfa9jsn198b89517758",
        "X-RapidAPI-Host": "realty-in-us.p.rapidapi.com",
      },
    };

    try {
      let response = await fetch(
        `https://realty-in-us.p.rapidapi.com/locations/v2/auto-complete?input=${searchTerm}&limit=10`,
        options
      );
      let json = await response.json();
      console.log("Resultat från API", json);
      console.log(json.autocomplete);
      console.log(json.autocomplete[0]);

      resultsContainer.innerHTML = "";
      resultsContainer.style.display = "block";

      for (let i = 0; i < json.autocomplete.length; i++) {
        let resultElement = document.createElement("div");
        resultElement.className = "resultElement";

        if (json.autocomplete[i].city) {
          let cityElement = document.createElement("p");
          cityElement.textContent = `City: ${json.autocomplete[i].city}`;
          resultElement.appendChild(cityElement);
        }

        if (
          json.autocomplete[i].full_address &&
          json.autocomplete[i].full_address.length > 0
        ) {
          let address = document.createElement("a");
          address.href = `https://www.google.com/maps/search/?api=1&query=${json.autocomplete[i].centroid.lat}%2C${json.autocomplete[i].centroid.lon}`;
          address.target = "_blank";
          address.textContent = `Address: ${json.autocomplete[i].full_address[0]}`;
          address.style.color = "blue";
          resultElement.appendChild(address);
        } else if (json.autocomplete[i].line) {
          let address = document.createElement("a");
          address.href = `https://www.google.com/maps/search/?api=1&query=${json.autocomplete[i].centroid.lat}%2C${json.autocomplete[i].centroid.lon}`;
          address.target = "_blank";
          address.textContent = `Address: ${json.autocomplete[i].line}`;
          address.style.color = "blue";
        } else {
          let areaType = document.createElement("p");
          areaType.textContent = `Area type: ${json.autocomplete[i].area_type}`;
          resultElement.appendChild(areaType);
        }
        if (json.autocomplete[i]._score) {
          let scoreElement = document.createElement("p");
          scoreElement.textContent = `Score: ${
            Math.round(json.autocomplete[i]._score * 100) / 100
          }`;
          resultElement.appendChild(scoreElement);
        }
        if (json.autocomplete[i].state_code) {
          let state = document.createElement("p");
          state.textContent = `State: ${json.autocomplete[i].state_code}`;
          resultElement.appendChild(state);
        }

        resultsContainer.appendChild(resultElement);
      }
    } catch (err) {
      console.error(err);
    }

    searchText.value = "";
  }
};
