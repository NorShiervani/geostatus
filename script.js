$(() => {
    const WEATHERBIT_API_KEY = "732839d858ff424cbd815536e6c31d5d";
    const PIXABAY_API_KEY = "15315498-9ff1536c360c66ee9d548dde0";

    $('#cityinput').on('input', function() {
        this.setAttribute('autocorrect', 'off')
        this.setAttribute('spellcheck', false)
    });

    $('#searchbutton').on('click', function() {
        let city = $('#cityinput').val();
        if (city.trim()) {
            fetchForecastData(city);
        } else {
            toggleDataSection(true);
            updateSearchStatus('Please enter a city.');
        }
    });

    function fetchForecastData(city) {
        //Template literals
        let forecasturl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHERBIT_API_KEY}`;

        $.getJSON(forecasturl, function(apidata) {
            if (apidata != null) {
                displayForecastData(apidata);
            } else {
                toggleDataSection(true);
                updateSearchStatus(`Couldn\'t find weather forecasts for city \"${city}\".`);
            }
        });
    }

    function displayForecastData(apidata) {
        toggleDataSection(false);
        $.each(apidata.data, function(i) {
            //ES6 Destructuring
            let {datetime, temp} = apidata.data[i];
            let {description, icon} = apidata.data[i].weather;
            let iconurl = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

            $('#data-section').append(
                `<div id='dayforecast'><div id='date'>${datetime}</div>
                <div id='description'>${description} (${temp} °C)
                <img id='weathericon' src="${iconurl}"</div></div>`);
        });
        updateSearchStatus(`Showing data for: ${apidata.city_name}`);
        displayCityBackground(apidata.city_name);
    }

    function updateSearchStatus(message) {
        $('#searchstatus').text(message);
    }

    function toggleDataSection(hide) {
        let newHeight = hide ? 0 : 300,
        animDuration = 450;

        $('#data-section').animate({ height: newHeight }, animDuration);
    }

    function displayCityBackground(city) {
        let URL = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${city}`;
        $.getJSON(URL, function(data) {
            if (parseInt(data.totalHits) > 0) {
                let randomindex = Math.floor(Math.random() * (data.hits.length + 1));
                let imageUrl = data.hits[randomindex].largeImageURL;
                $('#bg-image').css('background-image', `url(${imageUrl})`);
                $('#bg-color').css('opacity', 0.9);
            }
        });
    }
});