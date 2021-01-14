$(document).ready(function() {
    var searchButton = $("#searchButton");
    searchButton.on("click", function(event) {
        event.preventDefault();

        var searchTerm = $("#searchTerm").val();
        var d = new Date();
        var currentDate = (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear();
        var datePlusOne = (d.getMonth() + 1) + "-" + (d.getDate() + 1) + "-" + d.getFullYear();
        var datePlusTwo = (d.getMonth() + 1) + "-" + (d.getDate() + 2) + "-" + d.getFullYear();
        var datePlusThree = (d.getMonth() + 1) + "-" + (d.getDate() + 3) + "-" + d.getFullYear();
        var datePlusFour = (d.getMonth() + 1) + "-" + (d.getDate() + 4) + "-" + d.getFullYear();
        var datePlusFive = (d.getMonth() + 1) + "-" + (d.getDate() + 5) + "-" + d.getFullYear();

        var apiKey = "dfa4f612e4e020919f7d290bd34d8157";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + apiKey;

        function findWeatherData() {
            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function(response) {
                    var cityName = response.name;
                    var currentTemp = Math.round((response.main.temp - 273.15) * 1.8 + 32);
                    var humidity = response.main.humidity + "%";
                    var windSpeed = response.wind.speed + " MPH";
                    var latitude = response.coord.lat;
                    var longitude = response.coord.lon;
                    $("#cityEl").text(cityName + " (" + currentDate + ")");
                    $("#temperatureEl").text("Temperature: " + currentTemp + " F");
                    $("#humidityEl").text("Humidity: " + humidity);
                    $("#windSpeedEl").text("Wind Speed: " + windSpeed);
                    findUV(latitude, longitude);
                    searchHistory(cityName);
                });
        };

        function findUV(latitude, longitude) {
            var uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;
            $.ajax({
                url: uvIndexURL,
                method: "GET"
            })
                .then(function(response) {
                    var uviIndex = response.value;
                    $("#uviIndexEl").text("UVI Index: " + uviIndex);
                    forecastWeather(latitude, longitude);
                    if (uviIndex <= 2) {
                        $("#uviIndexEl").css("color", "green");
                    } else if (uviIndex >= 3 || uviIndex <= 5) {
                        $("#uviIndexEl").css("color", "yellow");
                    } else if (uviIndex >= 6 || uviIndex <= 7) {
                        $("#uviIndexEl").css("color", "orange");
                    } else if (uviIndex > 7) {
                        $("#uviIndexEl").css("color", "red");
                    };
                });
        };

        function forecastWeather(latitude, longitude) {
            var forecastURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts&appid=" + apiKey;
            $.ajax({
                url: forecastURL,
                method: "GET"
            })
                .then(function(response) {
                    $("#forecast-dateEl-one").text(datePlusOne);
                    var tempPlusOne = Math.round((response.daily[1].temp.day - 273) * 1.8 + 32);
                    $("#forecast-tempEl-one").text("Temperature: " + tempPlusOne + " F");
                    var humidityPlusOne = response.daily[1].humidity + "%";
                    $("#forecast-humidityEl-one").text("Humidity: " + humidityPlusOne);
                    
                    $("#forecast-dateEl-two").text(datePlusTwo);
                    var tempPlusTwo = Math.round((response.daily[2].temp.day - 273) * 1.8 + 32);
                    $("#forecast-tempEl-two").text("Temperature: " + tempPlusTwo + " F");
                    var humidityPlusTwo = response.daily[2].humidity + "%";
                    $("#forecast-humidityEl-two").text("Humidity: " + humidityPlusTwo);

                    $("#forecast-dateEl-three").text(datePlusThree);
                    var tempPlusThree = Math.round((response.daily[3].temp.day - 273) * 1.8 + 32);
                    $("#forecast-tempEl-three").text("Temperature: " + tempPlusThree + " F");
                    var humidityPlusThree = response.daily[3].humidity + "%";
                    $("#forecast-humidityEl-three").text("Humidity: " + humidityPlusThree);

                    $("#forecast-dateEl-four").text(datePlusFour);
                    var tempPlusFour = Math.round((response.daily[4].temp.day - 273) * 1.8 + 32);
                    $("#forecast-tempEl-four").text("Temperature: " + tempPlusFour + " F");
                    var humidityPlusFour = response.daily[4].humidity + "%";
                    $("#forecast-humidityEl-four").text("Humidity: " + humidityPlusFour);

                    $("#forecast-dateEl-five").text(datePlusFive);
                    var tempPlusFive = Math.round((response.daily[5].temp.day - 273) * 1.8 + 32);
                    $("#forecast-tempEl-five").text("Temperature: " + tempPlusFive + " F");
                    var humidityPlusFive = response.daily[5].humidity + "%";
                    $("#forecast-humidityEl-five").text("Humidity: " + humidityPlusFive);
                })
        };

        function searchHistory(cityName) {
            var cityNameArray = [];
            cityNameArray += cityName;
            localStorage.setItem("cityName", JSON.stringify(cityNameArray));
            var oldCityName = JSON.parse(localStorage.getItem("cityName"));
            var oldSearch = $(".search-history").append("<div>");
            oldSearch.text(oldCityName);
            oldSearch.append("<br>");
        };

        findWeatherData();
        searchHistory();
    });
});