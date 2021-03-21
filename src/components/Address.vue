<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">주소검색</div>
        <div class="text-subtitle2">by John Doe</div>
        <div class="row">
          <div style="width: 100%">
            <q-input
              square
              oulined
              v-model="juso"
              label="찾을 주소를 입력하세요"
            >
              <template v-slot:append>
                <q-btn round dense flat icon="fas fa-air-freshener" @click="find" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-black text-h6">
         {{ jusoRt }}
        </div>
      </q-card-section>
      <q-card-section>
        <div id="map" style="width: 100%; height: 350px;position: relative;">
          <div class="q-ma-md q-pa-sm text-bold bg-white" style="position: absolute; z-index: 2; opacity: 0.7">{{ centerAddr }}</div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      map: null,
      centerAddr: '',
      juso: '',
      jusoRt: '',
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
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      }
      this.map = new kakao.maps.Map(container, options)
      this.geocoder = new kakao.maps.services.Geocoder()
      const marker = new kakao.maps.Marker()
      this.searchAddrFromCoords(this.map.getCenter(), this.displayCenterInfo)
      kakao.maps.event.addListener(this.map, 'idle', () => {
        this.searchAddrFromCoords(this.map.getCenter(), this.displayCenterInfo)
      })
      kakao.maps.event.addListener(this.map, 'click', (mouseEvent) => {
        this.searchAddrFromCoords(mouseEvent.latLng, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            console.log(result)
            this.jusoRt = result[0].address_name
            marker.setPosition(mouseEvent.latLng)
            marker.setMap(this.map)
          }
        })
      })
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
    // 좌표로 행정동 주소 정보를 요청합니다
      this.geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback)
    },
    placesSearchCB (data, status) {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds()

        for (let i = 0; i < data.length; i++) {
          this.displayMarker(data[i])
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        this.map.setBounds(bounds)
      }
    },
    find () {
      console.log(this.jusoRt)
      this.ps = new kakao.maps.services.Places()
      this.ps.keywordSearch(this.juso, this.placesSearchCB)
    },
    displayMarker (place) {
      this.marker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(place.y, place.x)
      })
      kakao.maps.event.addListener(this.marker, 'click', () => {
        this.callback(place)
      })
    },
    callback (place) {
      console.log('call', this.marker, place)
      this.jusoRt = place.address_name
    }
  }
}
</script>
