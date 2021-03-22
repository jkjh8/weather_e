<template>
  <q-page>
    <div class="q-mx-xl">
      <q-separator inset />
      <Api />
      <q-separator inset />
      <Ipaddr />
      <q-separator inset />
    </div>
  </q-page>
</template>

<script>
import Api from '../components/Api'
import Ipaddr from '../components/Ipaddr'

export default {
  name: 'Setup',
  components: { Api, Ipaddr },
  data () {
    return {
      //
    }
  }
}
</script>
