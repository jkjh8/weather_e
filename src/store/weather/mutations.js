export function updateLocation (state, location) {
  state.location = location
}

export function updateWeather (state, weather) {
  state.weather = weather[0]
  state.weatherObj = weather[1]
}

export function updateDustLocations (state, locations) {
  state.dustLocations = locations
}

export function updateDustLocation (state, location) {
  state.dustLocation = location
}

export function updateDust (state, dust) {
  state.dust = dust
}
