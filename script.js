$(() => {
    const WEATHERBIT_API_KEY = "732839d858ff424cbd815536e6c31d5d";

    $("#cityinput").on('input', function() {
        this.setAttribute('autocomplete', 'off')
        this.setAttribute('autocorrect', 'off')
        this.setAttribute('autocapitalize', 'off')
        this.setAttribute('spellcheck', false)
    });

    $("#searchbutton").on('click', function() {
        searchForecast($("#cityinput").val());
    });

    function searchForecast(city) {
        var forecasturl = "https://api.weatherbit.io/v2.0/forecast/daily?city=" + city + "&key=" + WEATHERBIT_API_KEY;

        $.getJSON(forecasturl, function(apidata) {
            if (apidata != null) {
                displayForecastData(apidata);
            } else {
                $("#data_section").css("display", "none");
                updateSearchStatus('Couldn\'t find weather forecasts for city \"' + city + '\".');
            }
        });
    }

    function displayForecastData(apidata) {
        $("#data_section").empty();
        $("#data_section").css("display", "initial");

        $.each(apidata.data, function(index) {
            var date = apidata.data[index].datetime;
            var desc = apidata.data[index].weather.description + " (" + apidata.data[index].temp + " °C)";
            var iconurl = 'https://www.weatherbit.io/static/img/icons/' + apidata.data[index].weather.icon + '.png';

            $("#data_section").append(
                "<div id='dayforecast'><div id='date'>" +
                date + "</div><div id='description'>" +
                desc + "<img id='weathericon' src='" +
                iconurl + "'</div></div>");
        });
        updateSearchStatus('Showing data for: ' + apidata.city_name + ' (' + apidata.country_code + ')');
    }

    function updateSearchStatus(message) {
        $("#searchstatus").text(message);
    }
});