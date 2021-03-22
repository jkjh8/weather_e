export default {
  data () {
    return {
      dustLocUrl: 'http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList',
      dustUrl: 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty'
    }
  },
  methods: {
    dustLocQuery (place) {
      return `ServiceKey=${process.env.DUST_LOCATION_KET}&returnType=JSON&tmX=${place.tm.x}&tmY=${place.tm.y}&ver=1.0`
    },
    dustQuery (place) {
      return `ServiceKey=${process.env.DUST_KEY}&serviceKey=${process.env.DUST_KEY}&returnType=JSON&numOfRows=50pageNo=1` +
             `&stationName=${place.stationName}&dataTerm=DAILY&ver=1.0`
    }
  }
}
