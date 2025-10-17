const apiKey = 'dcc012d2c6a56b1396fcb5cf2fb684c3'
const lat = 50
const lon = 0
const weatherApi = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`

fetch(weatherApi)
.then(res => res.json())
.then(data =>{
    console.log('the api is working')
    console.log(data)
})
.catch(error =>{
    console.log(`error`, error)
})

//dom
const locationInput = document.getElementById('search')
const form = document.getElementById('form')

//event listener
form.addEventListener('submit-btn', (e)=>{
    e.preventDefault()
})