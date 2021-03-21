export function updateLocation (state, location) {
  state.location.address = location.address_name
  state.location.x = location.x
  state.location.y = location.y
}

export function updateWeather (state, weather) {
  const result = []
  weather.forEach((item, idx) => {
    console.log(item)
    switch (item.category) {
      case 'T1H':
        item.name = '기온'
        console.log(item)
        result.push(item)
        break
      case 'RN1':
        item.name = '강수량'
        result.push(item)
        break
      case 'UUU':
        item.name = '동서바람성분'
        result.push(item)
        break
      case 'VVV':
        item.name = '남북바람성분'
        result.push(item)
        break
      case 'REH':
        item.name = '습도'
        result.push(item)
        break
      case 'PTY':
        item.name = '강수형태'
        result.push(item)
        break
      case 'VEC':
        item.name = '풍향'
        result.push(item)
        break
      case 'WSD':
        item.name = '풍속'
        result.push(item)
        break
    }
  })
  console.log(result)
  state.weather = result
}
