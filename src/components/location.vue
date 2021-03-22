<template>
  <q-card>
      <q-card-section class="q-mx-md row items-center">
        <q-icon size="sm" name="fas fa-map"></q-icon>
        <span class="text-h6 q-mx-md">Location</span>
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
import { ipcRenderer, remote } from 'electron'
import Address from './Address'
import map from '../mixins/map'
import query from '../mixins/query'
const db = remote.getGlobal('db')

export default {
  name: 'Location',
  mixins: [map, query],
  components: { Address },
  computed: {
    ...mapState({
      location: state => state.weather.location,
      dustLocation: state => state.weather.dustLocation
    })
  },
  data () {
    return {
      map: null,
      mapId: 'map',
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
      console.log(data)
      if (this.map) {
        const position = new kakao.maps.LatLng(data.lat, data.lon)
        this.moveMarker(position)
        this.searchAddrFromCoords(position, (place) => {
          this.changePlace(place[0])
          // this.$store.commit('weather/updateLocation', place[0])
        })
        // this.getDustLocations(data.lat, data.lon)
      }
    })
    ipcRenderer.on('dustLocationRt', (e, data) => {
      console.log(data)
      this.$store.commit('weather/updateDustLocations', data.response.body.items)
      this.$store.commit('weather/updateDustLocation', data.response.body.items[0])
    })
  },
  methods: {
    /* global kakao */
    getIpLocation () {
      ipcRenderer.send('getLocation', 'http://extreme-ip-lookup.com/json')
    },
    changePlace (place) {
      const tm = this.getTm(place)
      place.tm = { x: tm[0], y: tm[1] }
      this.$store.commit('weather/updateLocation', place)
      const position = new window.kakao.maps.LatLng(place.y, place.x)
      this.moveMarker(position)
      db.update({ id: 'location' }, { $set: { value: place } }, { upsert: true })
      this.getDustLocations(place)
    },
    getDustLocations (place) {
      ipcRenderer.send('dustLocation', `${this.dustLocUrl}?${this.dustLocQuery(place)}`)
    }
  }
}
</script>
