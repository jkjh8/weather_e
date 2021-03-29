import { ipcRenderer } from 'electron'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapState({
      location: state => state.weather.location,
      weather: state => state.weather.weather,
      weatherObj: state => state.weather.weatherObj,
      dustLocations: state => state.weather.dustLocations,
      dustLocation: state => state.weather.dustLocation,
      dust: state => state.weather.dust
    })
  },
  data () {
    return {
      dustLocUrl: 'http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList',
      dustUrl: 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty',
      wetherUrl: 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst'
    }
  },
  methods: {
    dustLocQuery (place) {
      return `ServiceKey=${process.env.DUST_LOCATION_KET}&returnType=JSON&tmX=${place.tm.x}&tmY=${place.tm.y}&ver=1.0`
    },
    dustQuery (place) {
      return `ServiceKey=${process.env.DUST_KEY}&serviceKey=${process.env.DUST_KEY}&returnType=JSON&numOfRows=50pageNo=1&stationName=${place.stationName}&dataTerm=DAILY&ver=1.0`
    },
    weatherQuery (time, place) {
      return `serviceKey=${process.env.WEATHER_KEY}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${time.date}&base_time=${time.time}&nx=${place.xy.x}&ny=${place.xy.y}`
    },
    getTime () {
      const mome = moment()
      const date = moment(mome).format('YYYYMMDD')
      let time = moment(mome).format('HH00')
      const min = moment(mome).format('mm')
      if (min < 40) {
        if (time === '0000') {
          return { date: String(date - 1), time: '2300' }
        } else {
          time = String(time - 100)
          time = time.length >= 4 ? time : new Array(4 - time.length + 1).join('0') + time
          return { date: date, time: time }
        }
      } else {
        return { date: date, time: time }
      }
    },
    getDust () {
      if (this.dustLocations.length > 0 && !this.dustLocation.stationName) {
        this.$store.commit('weather/updateDustLocation', this.dustLocations[0])
      }
      ipcRenderer.send('dust', `${this.dustUrl}?${this.dustQuery(this.dustLocation)}`)
    },
    getWeather () {
      ipcRenderer.send('req', `${this.wetherUrl}?${this.weatherQuery(this.getTime(), this.location)}`)
    },
    getAll () {
      this.getDust()
      this.getWeather()
    }
  }
}
