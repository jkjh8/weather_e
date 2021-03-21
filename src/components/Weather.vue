<template>
  <q-card>
    <q-card-section class="q-mx-md row items-center">
      <q-icon size="sm" name="fas fa-bullseye"></q-icon>
      <span class="text-subtitle q-mx-md">Weather</span>
      <span>
        <q-icon :name="nowWeather.icon"></q-icon>
      </span>
      <span class="text-bold q-mx-md">{{ nowWeather.name }}</span>
      <span class="q-ml-md q-mr-xs text-caption">기준시간</span>
      <span class="q-mx-xs text-caption">{{ baseDate }}</span>
      <span class="q-mx-xs text-caption">{{ baseTime }}</span>
      <q-space />
      <q-btn flat round size="sm" icon="fas fa-sync-alt" @click="getData"></q-btn>
    </q-card-section>

    <q-card-section>
      <q-table
        :data="tableWeather"
        :columns="columns"
        hide-pagination
      />
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
    }),
    baseDate () {
      if (this.weather && this.weather[0]) {
        return moment(this.weather[0].baseDate).format('YYYY/MM/DD')
      } else {
        return ''
      }
    },
    baseTime () {
      if (this.weather && this.weather[0]) {
        return moment(this.weather[0].baseTime).format('LTS')
      } else {
        return ''
      }
    },
    tableWeather () {
      const result = {}
      this.weather.forEach(item => {
        result[item.category] = item.obsrValue
      })
      console.log(result)
      return [result]
    },
    nowWeather () {
      let result = {}
      let item = {}
      this.weather.forEach(row => {
        if (row.category === 'PTY') {
          item = row
        }
      })
      const id = Number(item.obsrValue)
      switch (id) {
        case 0:
          result = { id: id, name: '맑음', icon: 'fas fa-sun' }
          break
        case 1:
          result = { id: id, name: '비', icon: 'fas fa-umbrella' }
          break
        case 2:
          result = { id: id, name: '비/눈', icon: 'fas fa-braille' }
          break
        case 3:
          result = { id: id, name: '눈', icon: 'fas fa-snowflake' }
          break
        case 4:
          result = { id: id, name: '소나기', icon: 'fas fa-poo-storm' }
          break
        case 5:
          result = { id: id, name: '빗방울', icon: 'fas fa-cloud-rain' }
          break
        case 6:
          result = { id: id, name: '빗방울/눈날림', icon: 'fas fa-wind' }
          break
        case 7:
          result = { id: id, name: '눈날림', icon: 'fas fa-water' }
          break
      }
      console.log('wether', result)
      return result
    }
  },
  data () {
    return {
      key: process.env.WEATHER_KEY,
      site: 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst',
      columns: [
        {
          name: '기온',
          label: '기온 C',
          field: 'T1H',
          align: 'center'
        },
        {
          name: '강수량',
          label: '강수량 mm',
          field: 'RN1',
          align: 'center'
        },
        {
          name: '습도',
          label: '습도 %',
          field: 'REH',
          align: 'center'
        },
        {
          name: '풍향',
          label: '풍향 deg',
          field: 'VEC',
          align: 'center'
        },
        {
          name: '풍속',
          label: '풍속 m/s',
          field: 'WSD',
          align: 'center'
        }

      ]
    }
  },
  mounted () {
    ipcRenderer.on('weatherData', (e, data) => {
      if (data && data.response.body.items.item) {
        console.log(data.response.body)
        this.$store.commit('weather/updateWeather', data.response.body.items.item)
      } else {
        console.log('기상 정보를 가져올 수 없습니다.')
      }
    })
  },
  methods: {
    async getData () {
      const base = await this.getTime()
      console.log(base)
      const xy = convertXY('toXY', this.location.x, this.location.y)
      console.log(xy)
      const query = `serviceKey=${this.key}&numOfRows=10&pageNo=1` +
                    `&dataType=JSON&base_date=${base.date}&base_time=${base.time.padStart(4, '0')}` +
                    `&nx=${xy.x}&ny=${xy.y}`
      console.log(query)
      ipcRenderer.send('req', `${this.site}?${query}`)
    },
    async getTime () {
      const date = moment().format('YYYYMMDD')
      let time = moment().format('HH00')
      if (time === '0000') {
        return { date: date - 1, time: 2300 }
      } else {
        time = time - 100
        time = String(time)
        time = time.length >= 4 ? time : new Array(4 - time.length + 1).join('0') + time
        return { date: date, time: time }
      }
    }
  }
}
</script>
