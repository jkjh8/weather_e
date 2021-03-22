export default {
  data () {
    return {
      dustLocUrl: 'http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList'
    }
  },
  methods: {
    dustLocQuery (place) {
      return `ServiceKey=${process.env.DUST_LOCATION_KET}&returnType=JSON&tmX=${place.tm.x}&tmY=${place.tm.x}&ver=1.0`
    }
  }
}
