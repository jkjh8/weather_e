<template>
  <q-page>
    <div class="q-mx-xl">
      <q-separator inset />
      <Ipaddr />
      <q-separator inset />
    </div>
  </q-page>
</template>

<script>
import Ipaddr from '../components/Ipaddr'

export default {
  name: 'Setup',
  components: { Ipaddr },
  data () {
    return {
      setup: null
    }
  }
}
</script>
