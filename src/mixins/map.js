import { ipcRenderer } from 'electron'
import proj4 from 'proj4'

export const map = {
  data () {
    return {
      map: null,
      geocoder: null,
      ps: null,
      marker: null,
      clickMarker: null,
      markers: null,
      placeInfo: null
    }
  },
  mounted () {
    window.kakao && window.kakao.maps ? this.initMap() : this.addScript()
    ipcRenderer.on('locationData', (e, data) => {
      console.log(data)
      if (this.map) {
        const position = new kakao.maps.LatLng(data.lat, data.lon)
        this.marker.setPosition(position)
        this.map.setCenter(position)
        this.searchAddrFromCoords(this.map.getCenter(), (place) => {
          console.log(place[0])
          this.$store.commit('weather/updateLocation', place[0])
        })
      }
    })
    ipcRenderer.on('dustLocationRt', (e, data) => {
      console.log(data)
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
    setMapDisplayCenterInfo () {
      this.geocoder = new kakao.maps.services.Geocoder()
      this.searchAddrFromCoords(this.map.getCenter(), this.displayCenterInfo)
      kakao.maps.event.addListener(this.map, 'idle', () => {
        this.searchAddrFromCoords(this.map.getCenter(), this.displayCenterInfo)
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
        const bounds = new kakao.maps.LatLngBounds()

        for (let i = 0; i < data.length; i++) {
          this.displayMarker(data[i])
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
        }

        this.map.setBounds(bounds)
      }
    },
    findPlace (keyword) {
      this.ps = new kakao.maps.services.Places()
      this.ps.keywordSearch(keyword, this.placesSearchCB)
    },
    displayMarker (place) {
      this.marker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(place.y, place.x)
      })
      kakao.maps.event.addListener(this.marker, 'click', () => {
        this.callbackMarker(place)
      })
    },
    callbackMarker (place) {
      console.log('Place Info : ', place)
      this.placeInfo = place
    },
    getIpLocation () {
      ipcRenderer.send('getLocation', 'http://extreme-ip-lookup.com/json')
    },
    changePlace () {
      const position = new kakao.maps.LatLng(this.location.y, this.location.x)
      this.marker.setPosition(position)
      this.map.setCenter(position)
      console.log(this.location)
      const firstProjection = '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'
      const secondProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
      const tm = proj4(secondProjection, firstProjection, [Number(this.location.x), Number(this.location.y)])

      const url = 'http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList'
      const queryParams = `ServiceKey=${process.env.DUST_LOCATION_KET}` +
                          `&returnType=JSON&tmX=${tm[0]}&tmY=${tm[1]}&ver=1.0`
      ipcRenderer.send('dustLocation', `${url}?${queryParams}`)
    }
  }
}
