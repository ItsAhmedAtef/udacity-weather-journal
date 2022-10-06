// variables
const button = document.getElementById("generate");
const zip = document.getElementById("zip");
const feelings = document.getElementById("feelings");
const temp = document.getElementById("temp");
const date = document.getElementById("date");
const content = document.getElementById("content");
const error = document.getElementById("error");
const loading = document.getElementById("loading");

const weatherURL = "https://api.openweathermap.org/data/2.5/weather";
const appid = "<your_api_key_here>";
/**************************************************/

// get saved data and update UI
const getProjectData = async () => {
    await fetch("/projectData")
        .then(response => response.json())
        .then( data => {
            if (data.temp && data.date) {
                temp.innerHTML = `Temperature: <span class="val">${data.temp}</span>`;
                date.innerHTML = `Date: <span class="val">${data.date}</span>`;
            }
            if (data.content) {
                content.innerHTML = `User Response: <span class="val">${data.content}</span>`;
            } else {
                content.innerHTML = "";
            }
        }).catch( err => console.error(err));
};
getProjectData();

// send data to back-end
const postProjectData = async (url = "", data = {}) => {
    await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).catch( err => console.error(err));
};

/**
 * get weather data
 *
 * @return temperature | type number
 */
const getWeatherData = async (weatherURL, zip, appid) => {
    try {
        let fullUrl = `${weatherURL}?zip=${zip}&appid=${appid}&units=imperial`;
        return await fetch(fullUrl)
            .then( response => response.json() )
            .then( data => {
                if (data.cod !== 200) {
                    error.innerHTML = data.message;
                } else {
                    return data.main.temp;
                }
            });
    } catch (err) {
        console.error(err);
    }
    return;
};

/**
 * listen on generate button, method click
 *
 * get temp info
 * send it to back-end
 * get saved data and update UI
 */
button.addEventListener("click", async () => {
    loading.style.display = "block";
    error.innerHTML = "";
    await getWeatherData(weatherURL, zip.value, appid)
    .then( async result => {
        if (typeof result === "number") {
            // successful retrieve

            // Create a new date instance dynamically with JS
            let d = new Date();
            let newDate = `${d.getMonth()}.${d.getDate()}.${d.getFullYear()}`;

            let data = {
                temp: Math.round(result) + " degrees",
                date: newDate,
                content: feelings.value
            };
            await postProjectData("/projectData", data);
            await getProjectData();
        }
    });
    loading.style.display = "none";
});
