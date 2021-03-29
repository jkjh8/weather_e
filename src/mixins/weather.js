import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      weather: state => state.weather.weather
    })
  },
  methods: {
    addWeatherName (weather) {
      console.log(weather)
      const result = {}
      weather.forEach(item => {
        switch (item.category) {
          case 'T1H':
            item.name = '기온'
            result.T1H = item.obsrValue
            break
          case 'RN1':
            item.name = '강수량'
            result.RN1 = item.obsrValue
            break
          case 'UUU':
            item.name = '동서바람성분'
            result.UUU = item.obsrValue
            break
          case 'VVV':
            item.name = '남북바람성분'
            result.VVV = item.obsrValue
            break
          case 'REH':
            item.name = '습도'
            result.REH = item.obsrValue
            break
          case 'PTY':
            item.name = '강수형태'
            result.PTY = item.obsrValue
            break
          case 'VEC':
            item.name = '풍향'
            result.VEC = item.obsrValue
            break
          case 'WSD':
            item.name = '풍속'
            result.WSD = item.obsrValue
            break
        }
      })
      console.log(result)
      return result
    },
    currentWeather (weatherObj) {
      let result = {}
      switch (Number(weatherObj.PTY)) {
        case 0:
          result = { id: weatherObj.PTY, name: '맑음', icon: 'fas fa-sun' }
          break
        case 1:
          result = { id: weatherObj.PTY, name: '비', icon: 'fas fa-umbrella' }
          break
        case 2:
          result = { id: weatherObj.PTY, name: '비/눈', icon: 'fas fa-braille' }
          break
        case 3:
          result = { id: weatherObj.PTY, name: '눈', icon: 'fas fa-snowflake' }
          break
        case 4:
          result = { id: weatherObj.PTY, name: '소나기', icon: 'fas fa-poo-storm' }
          break
        case 5:
          result = { id: weatherObj.PTY, name: '빗방울', icon: 'fas fa-cloud-rain' }
          break
        case 6:
          result = { id: weatherObj.PTY, name: '빗방울/눈날림', icon: 'fas fa-wind' }
          break
        case 7:
          result = { id: weatherObj.PTY, name: '눈날림', icon: 'fas fa-water' }
          break
      }
      return result
    }
  }
}
