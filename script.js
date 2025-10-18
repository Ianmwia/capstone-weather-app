let apiKey = '36fd92a69321111547844661f619effd'

//dom
const locationInput = document.getElementById('search')
const form = document.getElementById('form')
const currentLocation = document.getElementById('current-location')

//event listener
form.addEventListener('submit', (e)=>{
    e.preventDefault()

    const city = locationInput.value
    fetchAndDisplayWeather(city)
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
        const locationTime = localTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})

        //append on html
        currentLocation.innerHTML = `
            <p>${location.name}</p>
            <p>${locationTime}</p>
            <p>${weather.main.temp.toFixed(1)} \u00B0C</p>
            <p>${weather.weather[0].main}</p>
        `
    }catch(error){
        console.error('error', error)
    }
    
}