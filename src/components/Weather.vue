<template>
  <q-card flat>
    <q-card-section class="q-mx-md row items-center">
      <q-icon size="sm" name="fas fa-bullseye"></q-icon>
      <span class="text-h6 q-mx-md">Weather</span>
      <span>
        <q-icon :name="nowWeather.icon"></q-icon>
      </span>
      <span class="text-bold q-mx-md">{{ nowWeather.name }}</span>
      <span class="q-ml-md q-mr-xs text-caption">기준시간</span>
      <span class="q-mx-xs text-caption">{{ baseDate }}</span>
      <span class="q-mx-xs text-caption">{{ baseTime }}</span>
      <q-space />
      <q-btn flat round size="sm" icon="fas fa-sync-alt" @click="getWeather"></q-btn>
    </q-card-section>

    <q-card-section>
      <q-table
        :data="[weatherObj]"
        :columns="columns"
        hide-pagination
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { ipcRenderer, remote } from 'electron'
import query from '../mixins/query'
import weather from '../mixins/weather'
const db = remote.getGlobal('db')

export default {
  mixins: [query, weather],
  computed: {
    ...mapState({
      location: state => state.weather.location,
      weather: state => state.weather.weather,
      weatherObj: state => state.weather.weatherObj
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
        return this.weather[0].baseTime.replace(/(.{2})/g, '$1:').slice(0, -1)
      } else {
        return ''
      }
    },
    nowWeather () {
      return this.currentWeather(this.weatherObj)
    }
  },
  data () {
    return {
      columns: [
        { name: '기온', label: '기온 C', field: 'T1H', align: 'center' },
        { name: '강수량', label: '강수량 mm', field: 'RN1', align: 'center' },
        { name: '습도', label: '습도 %', field: 'REH', align: 'center' },
        { name: '풍향', label: '풍향 deg', field: 'VEC', align: 'center' },
        { name: '풍속', label: '풍속 m/s', field: 'WSD', align: 'center' }
      ]
    }
  },
  mounted () {
    ipcRenderer.on('weatherData', async (e, data) => {
      if (data && data.response.header.resultCode === '00') {
        const weatherData = data.response.body.items.item
        const result = await this.addWeatherName(weatherData)
        this.$store.commit('weather/updateWeather', [weatherData, result])
        db.update({ id: 'weather' }, { $set: { value: result } }, { upsert: true })
      } else {
        console.log('기상 정보를 가져올 수 없습니다.')
      }
    })
  },
  methods: {
    //
  }
}
</script>
