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
        <q-card style="min-width: 400px;">
          search
        </q-card>
      </q-dialog>
    </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { map } from '../mixins/map'
export default {
  name: 'Location',
  mixins: [map],
  computed: {
    ...mapState({
      location: state => state.weather.location
    })
  },
  data () {
    return {
      searchPlace: false
    }
  }
}
</script>
