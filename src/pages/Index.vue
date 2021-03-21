<template>
  <q-page>
    <Location />
    <Weather />
    <Dust />
  </q-page>
</template>

<script>
import Location from '../components/location'
import Weather from '../components/Weather'
import Dust from '../components/Dust'

export default {
  name: 'PageIndex',
  components: { Location, Weather, Dust },
  data () {
    return {
      location: '1234'
    }
  }
}
</script>
