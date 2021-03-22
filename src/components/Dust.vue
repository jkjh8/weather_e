<template>
  <q-card>
    <q-card-section class="q-mx-md row items-center">
      <q-icon class="q-ml-sm" size="sm" name="fas fa-braille"></q-icon>
      <span class="text-h6 q-mx-md">Dust</span>
      <span class="text-subtitle">측정소:</span>
      <span
        v-if="dustLocation.stationName"
        class="text-subtitle text-bold"
      >
        {{ dustLocation.stationName }}
      </span>

      <span class="q-ml-md q-mr-xs text-caption">기준시간</span>
      <span v-if="dust[0]" class="q-mx-xs text-caption">{{ dust[0].dataTime }}</span>
      <q-space />
      <q-btn
        flat
        round
        icon="fas fa-map-marked-alt"
        @click="dialog=!dialog"
      />
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
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section class="q-pb-xs">
          <div class="text-h6">미세먼지 측정소 선택</div>
          <div class="text-subtitle2">가까운 측정소를 선택하세요</div>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item
              v-for="(item, idx) in dustLocations"
              :key="idx"
              class="q-my-sm"
              clickable
              v-ripple
              @click="selDustLocation(item)"
            >

              <q-item-section style="max-width: 400px; word-wrap: break-word;">
                <q-item-label>{{ item.stationName }}</q-item-label>
                <q-item-label caption lines="1">{{ item.addr }}</q-item-label>
              </q-item-section>

              <q-item-section side>{{ item.tm }}km</q-item-section>

            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { ipcRenderer, remote } from 'electron'
import query from '../mixins/query'
const db = remote.getGlobal('db')

export default {
  mixins: [query],
  computed: {
    ...mapState({
      dustLocations: state => state.weather.dustLocations,
      dustLocation: state => state.weather.dustLocation,
      dust: state => state.weather.dust
    })
  },
  data () {
    return {
      key: process.env.DUST_KEY,
      dialog: false,
      columns: [
        { name: 'dataTime', label: '측정시간', field: 'dataTime', align: 'center', style: 'width: 40px' },
        { name: 'khaiValue', label: '통합대기환경수치', field: 'khaiValue', align: 'center', style: 'width: 40px' },
        { name: 'khaiGrade', label: '통합대기환경수치(등급)', field: 'khaiGrade', align: 'center', style: 'width: 40px' },
        { name: 'pm10', label: '미세먼지(PM10) 농도', field: 'pm10Value', align: 'center', style: 'width: 20px' },
        { name: 'pm10Grade', label: '미세먼지(PM10) 등급', field: 'pm10Grade', align: 'center' },
        { name: 'pm25', label: '미세먼지(PM2.5) 농도', field: 'pm25Value', align: 'center' }, // 1: 좋음 2: 보통 3: 나쁨 4:매우나쁨
        { name: 'pm25Grade', label: '미세먼지(PM2.5) 등급', field: 'pm25Grade', align: 'center' },
        { name: 'coValue', label: '일산화탄소 농도', field: 'coValue', align: 'center' },
        { name: 'o3Value', label: '오존 농도', field: 'o3Value', align: 'center' }
      ]
    }
  },
  async mounted () {
    ipcRenderer.on('dust', (e, data) => {
      if (data && data.response.body.items) {
        this.$store.commit('weather/updateDust', data.response.body.items)
      } else {
        this.$q.notify({
          type: 'nagative',
          message: '미세먼지 정보를 가져올 수 없습니다.'
        })
        console.log('미세먼지 정보를 가져올 수 없습니다.')
      }
    })
    const res1 = await db.findOne({ id: 'dustlocations' })
    const res2 = await db.findOne({ id: 'dustlocation' })
    console.log(res1)
    if (res1) {
      this.$store.commit('weather/updateDustLocations', res1.value)
      this.$store.commit('weather/updateDustLocation', res2.value)
    }
  },
  methods: {
    async getData () {
      if (this.dustLocations.length > 0 && !this.dustLocation.stationName) {
        this.$store.commit('weather/updateDustLocation', this.dustLocations[0])
      }
      ipcRenderer.send('dust', `${this.dustUrl}?${this.dustQuery(this.dustLocation)}`)
    },
    selDustLocation (item) {
      this.$store.commit('weather/updateDustLocation', item)
      this.dialog = false
    }
  }
}
</script>
