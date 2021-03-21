<template>
  <q-card>
    <q-card-section class="q-mx-md row items-center">
      <q-icon class="q-ml-sm" size="sm" name="fas fa-braille"></q-icon>
      <span class="text-subtitle q-mx-lg">Dust</span>
      <span class="q-ml-md q-mr-xs text-caption">기준시간</span>
      <span v-if="dust[0]" class="q-mx-xs text-caption">{{ dust[0].dataTime }}</span>
      <q-space />
      <span class="q-mx-md" style="min-width: 100px">
        <q-select
          v-model="sel"
          :options="dustLocations"
          option-label="stationName"
          :label="dustLocation.stationName"
          dense
          @input="selDustLocation"
        ></q-select>
      </span>
      <q-btn flat round size="sm" icon="fas fa-sync-alt" @click="getData"></q-btn>
    </q-card-section>

    <q-card-section>
      <q-table
        style="max-height: 200px"
        :data="this.dust"
        :columns="columns"
      >
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { ipcRenderer } from 'electron'

export default {
  computed: {
    ...mapState({
      dustLocations: state => state.weather.dustLocations,
      dustLocation: state => state.weather.dustLocation,
      dust: state => state.weather.dust
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
    options () {
      return this.dustLocations.map(e => e.stationName)
    }
  },
  data () {
    return {
      key: process.env.DUST_KEY,
      sel: 0,
      site: 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst',
      columns: [
        {
          name: 'dataTime',
          label: '측정시간',
          field: 'dataTime',
          align: 'center',
          style: 'width: 40px'
        },
        {
          name: 'khaiValue',
          label: '통합대기환경수치',
          field: 'khaiValue',
          align: 'center',
          style: 'width: 40px'
        },
        {
          name: 'khaiGrade',
          label: '통합대기환경수치(등급)',
          field: 'khaiGrade',
          align: 'center',
          style: 'width: 40px'
        },
        {
          name: 'pm10',
          label: '미세먼지(PM10) 농도',
          field: 'pm10Value',
          align: 'center',
          style: 'width: 20px'
        },
        {
          name: 'pm10Grade',
          label: '미세먼지(PM10) 등급',
          field: 'pm10Grade',
          align: 'center'
        },
        {
          name: 'pm25',
          label: '미세먼지(PM2.5) 농도',
          field: 'pm25Value', // 1: 좋음 2: 보통 3: 나쁨 4:매우나쁨
          align: 'center'
        },
        {
          name: 'pm25Grade',
          label: '미세먼지(PM2.5) 등급',
          field: 'pm25Grade',
          align: 'center'
        },
        {
          name: 'coValue',
          label: '일산화탄소 농도',
          field: 'coValue',
          align: 'center'
        },
        {
          name: 'o3Value',
          label: '오존 농도',
          field: 'o3Value',
          align: 'center'
        }

      ]
    }
  },
  mounted () {
    ipcRenderer.on('dust', (e, data) => {
      console.log(data)
      if (data && data.response.body.items) {
        console.log(data.response.body)
        this.$store.commit('weather/updateDust', data.response.body.items)
      } else {
        console.log('기상 정보를 가져올 수 없습니다.')
      }
    })
  },
  methods: {
    async getData () {
      if (this.dustLocations.length > 0 && !this.dustLocation.stationName) {
        this.$store.commit('weather/updateDustLocation', this.dustLocations[0])
      }
      const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty'
      const query = `ServiceKey=${process.env.DUST_KEY}&serviceKey=${process.env.DUST_KEY}&returnType=JSON&numOfRows=50pageNo=1` +
                    `&stationName=${this.dustLocation.stationName}&dataTerm=DAILY&ver=1.0`
      console.log(query)
      ipcRenderer.send('dust', `${url}?${query}`)
    },
    selDustLocation () {
      this.$store.commit('weather/updateDustLocation', this.sel)
    }
  }
}
</script>
