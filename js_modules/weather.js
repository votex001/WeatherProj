export const weatherService = {
  getWeather
}
const apiKey = "08a3fc8b1a00aafe3af1610dd25afcee";











function getWeather(lat, lng) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((response) => {
      if (response.status === 200) return response.json();
      else throw new Error("Error while fetching the weather data.");
    })
    .then((data) => {

      const options = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      const dateTime = new Date(data.dt * 1000).toLocaleString('en-US', options);;

      renderWeather(data, dateTime)
    })
    .catch((error) => {
      console.error(error.message);
    });
}








function renderWeather(data, date) {
  const weather = document.querySelector('#weather')
  weather.innerHTML = `
  <div class="weather-container">
  <p>${date}</p>
  <p>
  <span>${data.sys.country}, ${data.name}</span>
</p >
      <p class="weather-info">
          <img class="weather-img" src="https://openweathermap.org/img/wn/10d@2x.png" style=""/>
          <span>${data.weather[0].main}</span>
        </p>
      <p>
          <span>Local temperfture:${data.main.temp}°</span>
      </p>
      <p>
          <i class="fa-solid fa-temperature-empty" aria-hidden="true"></i> min
          <span>${data.main.temp_min}</span>
          <i class="fa-solid fa-temperature-high" aria-hidden="true"></i> max
          <span>${data.main.temp_max}</span>
      </p>
      <p>
          <i class="fa-solid fa-wind" aria-hidden="true"></i> wind
          <span>${data.wind.speed}</span> m/s
      </p>
  </div>`




}