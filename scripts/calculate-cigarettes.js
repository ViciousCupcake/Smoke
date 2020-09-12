function callAPI() {
    fetch('https://api.airvisual.com/v2/nearest_city?key=f266937f-b607-4020-9f02-d8736895b3b9')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            appendData(data);
        })
        .catch(function (err) {
            alert(err);
            console.log('error: ' + err);
        });
}
async function appendData(data) {
    /*
    https://aqs.epa.gov/aqsweb/documents/codetables/aqi_breakpoints.html
    https://aqi.asia/
    */
    var div = document.createElement("div");
    div.innerHTML = 'Status: ' + ' ' + data.data.current.pollution.aqius;
    var I = data.data.current.pollution.aqius;
    var ih;
    var il;
    var ch;
    var cl;
    var msg;
    if (I < 50) {
        ih = 50;
        il = 0;
        ch = 12;
        cl = 0;
        msg = "Good";
    }
    else if (I < 100) {
        ih = 100;
        il = 51;
        ch = 35.4
        cl = 12.1
        msg = "Moderate";
    }
    else if (I < 150) {
        ih = 150;
        il = 101;
        ch = 55.4;
        cl = 35.5;
        msg = "Unhealthy for sensitive individuals"
    }
    else if (I < 200) {
        ih = 200;
        il = 151;
        ch = 150.4
        cl = 55.5
        msg = "Unhealthy";
    }
    else if (I < 300) {
        ih = 300;
        il = 201;
        ch = 250.4;
        cl = 150.5;
        msg = "Very Unhealthy";
    }
    else if (I < 400) {
        ih = 400;
        il = 301;
        ch = 350.4;
        cl = 250.5;
        msg = "Hazardous";
    }
    else if (I < 500) {
        ih = 500;
        il = 401;
        ch = 500.4;
        cl = 350.5;
        msg = "Hazardous";
    }
    else {
        ih = 999;
        il = 501;
        ch = 99999.9;
        cl = 500.5;
        msg = "Hazardous";
    }
    var C = (((I * ch) - (I * cl) + (ih * cl) - (il * ch)) / (ih - il));
    var cigarettes = C / 22;

    var mainContainer = document.getElementById("cigarette-container");

    document.getElementById("results").style.display = "initial";
    if (I > 100) {
        document.getElementById("home").style.backgroundColor = "#949494";
        document.getElementById("home").style.backgroundImage = 'url("images/smoke.jpg")';
    }
    else {
        document.getElementById("home").style.backgroundColor = "#655010";
        document.getElementById("home").style.backgroundImage = 'url("images/clean-scenary.jpg")';
    }
    var city = data.data.city;

    await fetch('https://geolocation-db.com/json/')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if ((!city === null)) {
                city = data.city;
            }
        })
        .catch(function (err) {
            console.log('error: ' + err);
        });

    document.getElementById("result-title").innerHTML = "<b>In " + city + ", You Involuntarily Smoke</b>";

    document.getElementById("results").style.opacity = 1;
    document.getElementById("initial").style.display = "none";
    document.getElementById("result-header").style.display = "block";


    for (var a = 0; a < cigarettes - 1; a++) {
        var div = document.createElement("div");
        div.classList.add("w3-black", "w3-round-xlarge", "w3-padding-8", "meter", "w3-display-middle");
        div.style.maxWidth = "64vw";
        div.innerHTML = "<span style='height:3vh;width:100%'><span class='container w3-center w3-round-xlarge cig-gradient progress'></span></span>";

        mainContainer.appendChild(div);
        var br = document.createElement("br");
        mainContainer.appendChild(br)
        await new Promise(r => setTimeout(r, 1050)); /*https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep*/
    }

    var div = document.createElement("div");
    div.classList.add("w3-black", "w3-round-xlarge", "w3-padding-8", "meter", "w3-display-middle");
    div.style.maxWidth = "64vw";
    var remainder = Math.round((cigarettes - Math.floor(cigarettes)) * 100);
    div.innerHTML = "<span style='height:3vh;width:" + remainder + "%'><span class='container w3-center w3-round-xlarge cig-gradient progress'></span></span>";
    mainContainer.appendChild(div);
    await new Promise(r => setTimeout(r, 1050));

    document.getElementById("first-third").innerHTML = "AQI: " + I + "\u2014" + msg;
    document.getElementById("second-third").innerHTML = "PM<sub>2.5</sub> conc.: " + C.toFixed(2) + " \u00B5g/m<sup>3</sup>";
    document.getElementById("third-third").innerHTML = "Cigarette equivalency: " + cigarettes.toFixed(2) + " cigarettes/day";
}