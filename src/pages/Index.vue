<template>
  <q-page>
    <Location />
    <Weather />
  </q-page>
</template>

<script>
import Location from 'src/components/location.vue'
import Weather from '../components/Weather'

export default {
  name: 'PageIndex',
  components: { Location, Weather },
  data () {
    return {
      location: '1234'
    }
  }
}
</script>
