<template>
  <q-card>
    <q-card-section>
      날씨 정보
      <q-btn @click="getData">Get</q-btn>
      {{ rtData }}
    </q-card-section>
  </q-card>
</template>

<script>
import moment from 'moment'
import { ipcRenderer } from 'electron'
import convertXY from '../api/convertXY'

export default {
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
      this.rtData = data.response.body.items.item
      console.log(data)
    })
  },
  methods: {
    async getData () {
      const date = moment().format('YYYYMMDD')
      const time = await this.getTime(moment().format('HHMM'))
      const xy = convertXY('toXY', 33.450701, 126.570667)
      console.log(xy)
      const query = `serviceKey=${this.key}&numOfRows=10&pageNo=1` +
                    `&dataType=JSON&base_date=${date}&base_time=${time}` +
                    `&nx=${xy.x}&ny=${xy.y}`
      console.log(query)
      ipcRenderer.send('req', `${this.site}?${query}`)
    },
    async getTime (time) {
      console.log('start', time)
      for (let i = 0; i < this.baseTimes.length; i++) {
        if (Number(this.baseTimes[i]) < Number(time)) {
          console.log(this.baseTimes[i])
          return this.baseTimes[i]
        }
      }
    }
  }
}
</script>
