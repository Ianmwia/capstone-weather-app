let apiKey = '36fd92a69321111547844661f619effd'

//dom
const locationInput = document.getElementById('search')
const form = document.getElementById('form')
const currentLocation = document.getElementById('current-location')
const HourlyForecast = document.getElementById('hourly-forecast')
const otherData = document.getElementById('other-data')
const dailyForecast = document.getElementById('daily-forecast')

//weather icons
const weatherIcons = {
    clear: '/weather-icons/clear-svg.png',
    clouds: '/weather-icons/clouds-svg.png',
    rain: '/weather-icons/rain-svg.png',
    thunderstorm: '/weather-icons/thunderstorm-svg.png'
}

//event listener
form.addEventListener('submit', (e)=>{
    e.preventDefault()

    const city = locationInput.value || 'London'
    fetchAndDisplayWeather(city)
    fetchAndDisplayHourlyData(city)
    fetchAndDisplayDailyForecast(city)
})

//geocode translate longitude and latitude
//geocoding get city name
async function getCoordinates(city) {
    const cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
    const result = await fetch(cityUrl)
    const data = await result.json()
    if (!data.length) throw 'City not Found'
    return data [0]
}

async function getWeather(lat, lon) {
    const cityCoord = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    const response = await fetch(cityCoord)
    return response.json()
    
}

async function fetchAndDisplayWeather(city) {
    if (!city){
        alert('enter a city name')
        return
    }
    try {
        const location = await getCoordinates(city)
        const weather = await getWeather(location.lat, location.lon)

        //change time to location based
        const timeChange = weather.timezone
        const localTime = new Date((weather.dt + timeChange) *1000)
        //const locationTime = localTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        const locationTime = localTime.toUTCString().slice(17,22)

        //add weather icons
        const weatherConditions = weather.weather[0].main.toLowerCase()
        const iconsPath = weatherIcons[weatherConditions] || '/weather-icons/clear-svg.png'

        //append on html
        currentLocation.innerHTML = `
            <div class='top'>
                <p>${location.name}</p>
                <p>${locationTime}</p>
            </div>
            <p>${weather.main.temp.toFixed(1)} <span class='uni'>\u00B0C</span></p>
            <p><img src="${iconsPath}">${weatherConditions}</p>
        `
        //fetch other data -- uv humidity, wind speed, uv index
        //append
        otherData.innerHTML = `
            <p>Feels Like: ${weather.main.feels_like.toFixed(1)} \u00B0C</p>
            <p>Humidity: ${weather.main.humidity} %</p>
            <p>Wind Speed: ${(weather.wind.speed *3.6).toFixed(1)} km/h</p>
        `

        //clear input field
        locationInput.value = ''
    }catch(error){
        console.error('error', error)
    }
    
}

// get 3 hour forecast
async function getHourlyForecast(lat, lon) {
    const cityForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    const response = await fetch(cityForecast)
    const data = await response.json()
    return data  
}
async function fetchAndDisplayHourlyData(city){
    try{
        const location = await getCoordinates(city)
        const currentWeather = await getWeather(location.lat, location.lon)
        const timeZoneOffset = currentWeather.timezone

        const forecastData = await getHourlyForecast(location.lat, location.lon)

        HourlyForecast.innerHTML = ''

        forecastData.list.slice(0,5).forEach(item => {
            const localTime = new Date((item.dt + timeZoneOffset) *1000)
            const time = localTime.toUTCString().slice(17,22)
            const temp = item.main.temp.toFixed(1)
            const weather = item.weather[0].main.toLowerCase()

            //weather icons
            const iconsPath = weatherIcons[weather] || '/weather-icons/clear-svg.png'

            //append
            HourlyForecast.innerHTML +=`
                <div>
                    <p>${time}</p>
                    <p>${temp} \u00B0C</p>
                    <p><img src='${iconsPath}'>${weather}</p>
                </div>
            `
        })
    }catch(error){
        console.error('error', error)
    }
}

//5 day weather forecast
async function fetchAndDisplayDailyForecast(city){
    try {
        const location = await getCoordinates(city)
        const data = await getHourlyForecast(location.lat, location.lon)
        dailyForecast.innerHTML = ''

        const days = {}

        //1 forecast a day
        data.list.forEach(item => {
            const day = item.dt_txt.split(' ')[0]
            if (!days[day] || item.dt_txt.includes('12:00:00')){
                days[day] = item
            }
            })
        
        Object.values(days).slice(0,5).forEach(item => {
            const date = new Date(item.dt_txt.split(' ')[0]).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})
            const temp = item.main.temp.toFixed(1)
            const weather = item.weather[0].main.toLowerCase()

            //weather icons
            const iconsPath = weatherIcons[weather] || '/weather-icons/clear-svg.png'
        
            dailyForecast.innerHTML += `
                <div>
                <p>${date}</p>
                <p>${temp} \u00B0C</p>
                <p><img src='${iconsPath}'>${weather}</p>
                </div>
            `
        })
    }catch(error){
        console.error('error', error)
    }
}
// add default region because html data is aapended
window.addEventListener('load', ()=>{
    const city = 'London'
    fetchAndDisplayWeather(city)
    fetchAndDisplayHourlyData(city)
    fetchAndDisplayDailyForecast(city)
})