import proj4 from 'proj4'
import { mapState } from 'vuex'
import { remote } from 'electron'
const db = remote.getGlobal('db')

export default {
  computed: {
    ...mapState({
      location: state => state.weather.location
    })
  },
  methods: {
    addScript () {
      const script = document.createElement('script')
      script.onload = () => kakao.maps.load(this.initMap)
      script.src = 'http://dapi.kakao.com/v2/maps/sdk.js' +
                    '?autoload=false&appkey=' +
                    process.env.KAKAO_JS_KEY +
                    '&libraries=services'
      document.head.appendChild(script)
    },
    async initMap () {
      let place
      /* global kakao */
      if (this.location) {
        const result = await db.findOne({ id: 'location' })
        if (result) {
          this.$store.commit('weather/updateLocation', result.value)
          place = new kakao.maps.LatLng(result.value.y, result.value.x)
        } else {
          place = new kakao.maps.LatLng(37.5642135, 127.0016985)
        }
      }
      const container = document.getElementById(this.mapId)
      const options = { center: place, level: 3 }
      this.map = new kakao.maps.Map(container, options)
      this.addMarker(this.map)
      this.geocoder = new kakao.maps.services.Geocoder()
    },
    addMarker (map) {
      this.marker = new kakao.maps.Marker({
        map: map,
        position: map.getCenter()
      })
    },
    searchAddrFromCoords (coords, callback) {
      this.geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback)
    },
    search () {
      this.ps = new kakao.maps.services.Places()
      this.ps.keywordSearch(this.place, this.placesSearchCB)
    },
    moveMarker (position) {
      this.marker.setPosition(position)
      this.map.setCenter(position)
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
    getTm (location) {
      const firstProjection = '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'
      const secondProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
      return proj4(secondProjection, firstProjection, [Number(location.x), Number(location.y)])
    }
  }
}
