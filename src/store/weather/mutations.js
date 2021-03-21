export function updateLocation (state, location) {
  state.location.address = location.address_name
  state.location.x = location.x
  state.location.y = location.y
}

export function updateWeather (state, weather) {
  state.weather.date = weather[0].baseDate
  state.weather.time = weather[0].baseTime
  state.weather.location = state.location
  weather.forEach(item => {
    state.weather[item.category].value = item.obsrValue
  })
}
