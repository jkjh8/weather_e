<template>
  <q-card style="min-width: 600px">
    <q-card-section class="q-pb-xs">
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
    <q-card-section class="q-pt-xs" style="max-height: 120px; overflow-y: auto;">
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
        <div
          v-if="currentPlace && currentPlace.address_name"
          class="q-ma-md q-pa-sm text-bold text-white bg-black"
          style="position: absolute; z-index: 2; opacity: 0.5"
        >
          {{ currentPlace.address_name }}
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn flat label="Add address" @click="submit" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script>
import map from '../mixins/map'
export default {
  name: 'PageIndex',
  mixins: [map],
  data () {
    return {
      map: null,
      mapId: 'mapDialog',
      centerAddr: '',
      place: '',
      places: [],
      currentPlace: null,
      marker: null,
      ps: null,
      geocoder: null
    }
  },
  async mounted () {
    await this.initMap()
    this.addMapClickEvent()
  },
  methods: {
    /* global kakao */
    placesSearchCB (data, status) {
      if (status === kakao.maps.services.Status.OK) {
        console.log(data)
        this.places = data
      }
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
      // this.$store.commit('weather/updateLocation', this.currentPlace)
      this.$emit('changePlace', this.currentPlace)
    }
  }
}
</script>
