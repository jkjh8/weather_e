<template>
  <q-card style="min-width: 600px">
    <q-card-section>
      <div class="text-h6">주소검색</div>
      <div class="text-subtitle2">주소를 겁색하거나 지도에 위치를 클륵하세요</div>
      <div class="row">
        <div
          class="q-mx-md"
          style="width: 100%"
        >
          <q-input
            square
            oulined
            v-model="place"
            @keyup.enter="search"
            label="찾을 주소를 입력하세요"
          >
            <template v-slot:append>
              <q-btn
                round
                dense
                flat
                size="sm"
                icon="fas fa-search"
                @click="search"
              />
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
    <q-card-section style="max-height: 120px; overflow-y: auto;">
      <q-list>
        <q-item
          v-for="(item, idx) in places"
          :key="idx"
          class="q-my-sm"
          clickable
          v-ripple
          @click="clickList(idx)"
        >

          <q-item-section>
            <q-item-label>{{ item.place_name }}</q-item-label>
            <q-item-label caption lines="1">{{ item.address_name }}</q-item-label>
          </q-item-section>

        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section>
      <div id="mapDialog" style="width: 100%; height: 350px;position: relative;">
        <div class="q-ma-md q-pa-sm text-bold bg-white" style="position: absolute; z-index: 2; opacity: 0.7">{{ centerAddr }}</div>
      </div>
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn flat label="Add address" @click="submit" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      map: null,
      centerAddr: '',
      place: '',
      places: [],
      currentPlace: null,
      marker: null,
      ps: null,
      geocoder: null
    }
  },
  mounted () {
    window.kakao && window.kakao.maps ? this.initMap() : this.addScript()
  },
  methods: {
    addScript () {
      const script = document.createElement('script') /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap)
      script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.KAKAO_JS_KEY}&libraries=services`
      document.head.appendChild(script)
    },
    initMap () {
      const container = document.getElementById('mapDialog')
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
      this.searchAddrFromCoords(this.map.getCenter(), this.displayCenterInfo)
      kakao.maps.event.addListener(this.map, 'idle', () => {
        this.searchAddrFromCoords(this.map.getCenter(), this.displayCenterInfo)
      })
      this.addMapClickEvent()
    },
    displayCenterInfo (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].region_type === 'H') {
            this.centerAddr = result[i].address_name
            break
          }
        }
      }
    },
    searchAddrFromCoords (coords, callback) {
      this.geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback)
    },
    search () {
      this.ps = new kakao.maps.services.Places()
      this.ps.keywordSearch(this.place, this.placesSearchCB)
    },
    placesSearchCB (data, status) {
      if (status === kakao.maps.services.Status.OK) {
        console.log(data)
        this.places = data
      }
    },
    addMapClickEvent () {
      kakao.maps.event.addListener(this.map, 'click', (mouseEvent) => {
        this.searchAddrFromCoords(mouseEvent.latLng, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            this.marker.setPosition(mouseEvent.latLng)
            this.currentPlace = result[0]
          }
        })
      })
    },
    clickList (idx) {
      console.log(idx)
      const item = this.places[idx]
      const position = new kakao.maps.LatLng(item.y, item.x)
      this.marker.setPosition(position)
      this.map.setCenter(position)
      this.currentPlace = item
      // this.$store.commit('weather/updateLocation', item)
    },
    submit () {
      this.$store.commit('weather/updateLocation', this.currentPlace)
      this.$emit('changePlace')
    }
  }
}
</script>
