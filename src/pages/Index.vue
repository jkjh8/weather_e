<template>
  <q-page>
    <q-card>
      <q-card-section class="q-mx-md row items-center">
        <q-icon size="sm" name="fas fa-map"></q-icon>
        <span class="text-subtitle q-mx-md">Location</span>
        <span class="text-bold q-mx-md">{{location}}</span>
        <q-space />
        <q-btn flat round icon="fas fa-map-marked-alt"></q-btn>
      </q-card-section>
      <q-card-section class="q-mx-md row items-center">
        <div id="map" style="width: 100%; height: 250px; background: gray"></div>
      </q-card-section>
    </q-card>
    <Weather />
  </q-page>
</template>

<script>
import Weather from '../components/Weather'

export default {
  name: 'PageIndex',
  components: { Weather },
  data () {
    return {
      location: '1234'
    }
  }
}
</script>
