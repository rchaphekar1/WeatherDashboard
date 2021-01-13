$(document).ready(function() {
    var searchButton = $("#searchButton");
    searchButton.on("click", function(event) {
        event.preventDefault();

        var searchTerm = $("#searchTerm").val();
        var d = new Date();
        var currentDate = (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear();
        console.log(currentDate);

        var apiKey = "dfa4f612e4e020919f7d290bd34d8157";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + apiKey;

        function findWeatherData() {
            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function(response) {
                    var cityName = response.name;
                    var currentTemp = (response.main.temp - 273.15) * 1.8 + 32;
                    var humidity = response.main.humidity + "%";
                    var windSpeed = response.wind.speed + " MPH";
                    var latitude = response.coord.lat;
                    var longitude = response.coord.lon;
                    console.log(cityName);
                    $("#cityEl").text(cityName + " (" + currentDate + ")");
                    $("#temperatureEl").text("Temperature: " + currentTemp);
                    console.log(currentTemp);
                    console.log(humidity);
                    $("#humidityEl").text("Humidity: " + humidity);
                    console.log(windSpeed);
                    $("#windSpeedEl").text("Wind Speed: " + windSpeed);
                    console.log(latitude);
                    console.log(longitude);
                    findUV(latitude, longitude);
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
                    console.log(uviIndex);
                    $("#uviIndexEl").text("UVI Index: " + uviIndex);
                    forecastWeather(latitude, longitude);
                })
        };

        function forecastWeather(latitude, longitude) {
            var forecastURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts&appid=" + apiKey;
            $.ajax({
                url: forecastURL,
                method: "GET"
            })
                .then(function(response) {
                    console.log(response);
                })
        };

        findWeatherData();
    });
});