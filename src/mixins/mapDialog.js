import { ipcRenderer } from 'electron'

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
    },
    addMapClickEvent () {
      this.clickMarker = new kakao.maps.Marker()
      kakao.maps.event.addListener(this.map, 'click', (mouseEvent) => {
        this.searchAddrFromCoords(mouseEvent.latLng, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            console.log(result)
            this.jusoRt = result[0].address_name
            this.clickMarker.setPosition(mouseEvent.latLng)
            this.clickMarker.setMap(this.map)
          }
        })
      })
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
    }
  }
}
