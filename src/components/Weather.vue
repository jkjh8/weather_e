<template>
  <q-card>
    <q-card-section>
      날씨 정보
      <q-btn @click="getData">Get</q-btn>
      {{ weather }}
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { ipcRenderer } from 'electron'
import convertXY from '../api/convertXY'

export default {
  computed: {
    ...mapState({
      location: state => state.weather.location,
      weather: state => state.weather.weather
    })
  },
  data () {
    return {
      key: process.env.WEATHER_KEY,
      nx: '18',
      ny: '1',
      site: 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst',
      baseTimes: ['2300', '2000', '1700', '1400', '1100', '0800', '0500', '0200'],
      rtData: ''
    }
  },
  mounted () {
    ipcRenderer.on('weatherData', (e, data) => {
      if (data && data.response.body.items.item) {
        this.$store.commit('weather/updateWeather', data.response.body.items.item)
      } else {
        console.log('기상 정보를 가져올 수 없습니다.')
      }
    })
  },
  methods: {
    async getData () {
      const base = await this.getTime()
      const xy = convertXY('toXY', this.location.x, this.location.y)
      console.log(xy)
      const query = `serviceKey=${this.key}&numOfRows=10&pageNo=1` +
                    `&dataType=JSON&base_date=${base.date}&base_time=${base.time}` +
                    `&nx=${xy.x}&ny=${xy.y}`
      console.log(query)
      ipcRenderer.send('req', `${this.site}?${query}`)
    },
    async getTime () {
      const date = moment().format('YYYYMMDD')
      const time = moment().format('HH00')
      if (time === '0000') {
        return { date: date - 1, time: 2300 }
      } else {
        return { date: date, time: time - 100 }
      }
    }
  }
}
</script>
