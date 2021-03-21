<template>
  <q-card>
      <q-card-section class="q-mx-md row items-center">
        <q-icon size="sm" name="fas fa-map"></q-icon>
        <span class="text-subtitle q-mx-md">Location</span>
        <span class="text-bold q-mx-md">{{ location.address }}</span>
        <q-space />
        <q-btn
          flat
          round
          icon="fas fa-map-marked-alt"
          @click="getIpLocation"
        />
        <q-btn
          flat
          round
          icon="fas fa-search-location"
          @click="searchPlace=!searchPlace"
        />
      </q-card-section>

      <q-card-section class="q-mx-md row items-center">
        <div id="map" style="width: 100%; height: 250px; background: gray"></div>
      </q-card-section>
      <q-dialog v-model="searchPlace">
        <Address @changePlace="changePlace" />
      </q-dialog>
    </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { ipcRenderer } from 'electron'
import proj4 from 'proj4'
import Address from './Address'

export default {
  name: 'Location',
  components: { Address },
  computed: {
    ...mapState({
      location: state => state.weather.location
    })
  },
  data () {
    return {
      map: null,
      geocoder: null,
      ps: null,
      marker: null,
      placeInfo: null,
      searchPlace: false
    }
  },
  mounted () {
    window.kakao && window.kakao.maps ? this.initMap() : this.addScript()
    ipcRenderer.on('locationData', (e, data) => {
      if (this.map) {
        const position = new kakao.maps.LatLng(data.lat, data.lon)
        this.moveMarker(position)
        this.searchAddrFromCoords(position)
        this.getDustLocations(data.lat, data.lon)
      }
    })
    ipcRenderer.on('dustLocationRt', (e, data) => {
      console.log(data.response.body.items)
      this.$store.commit('weather/updateDustLocations', data.response.body.items)
    })
  },
  methods: {
    addScript () {
      const script = document.createElement('script') /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap)
      script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.KAKAO_JS_KEY}&libraries=services`
      document.head.appendChild(script)
    },
    initMap () {
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(37.5642135, 127.0016985),
        level: 3
      }
      this.map = new kakao.maps.Map(container, options)
      this.marker = new kakao.maps.Marker({
        map: this.map,
        position: this.map.getCenter()
      })
      this.geocoder = new kakao.maps.services.Geocoder()
    },

    searchAddrFromCoords (coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
      this.geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), (place) => {
        this.$store.commit('weather/updateLocation', place[0])
      })
    },
    getIpLocation () {
      ipcRenderer.send('getLocation', 'http://extreme-ip-lookup.com/json')
    },
    moveMarker (position) {
      this.marker.setPosition(position)
      this.map.setCenter(position)
    },
    changePlace () {
      const position = new kakao.maps.LatLng(this.location.y, this.location.x)
      this.moveMarker(position)
      this.getDustLocations(this.location.y, this.location.x)
    },
    getDustLocations (x, y) {
      const firstProjection = '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'
      const secondProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
      const tm = proj4(secondProjection, firstProjection, [Number(this.location.x), Number(this.location.y)])

      const url = 'http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList'
      const queryParams = `ServiceKey=${process.env.DUST_LOCATION_KET}&returnType=JSON&tmX=${tm[0]}&tmY=${tm[1]}&ver=1.0`
      ipcRenderer.send('dustLocation', `${url}?${queryParams}`)
    }
  }
}
</script>
