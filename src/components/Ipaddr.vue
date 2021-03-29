<template>
  <q-card flat>
    <q-card-section class="row items-center q-py-sm">
      <q-icon size="xs" color="teal" name="fas fa-network-wired"></q-icon>
      <span class="text-subtitle1 q-mx-md">Tcp Socket Port</span>
      <q-space />
      <span style="max-width: 100px">
        <q-input outlined dense v-model="serverport"></q-input>
      </span>
      <q-btn class="q-ml-sm" flat round size="sm" icon="fas fa-check" color="green" @click="updateServerPort"></q-btn>
    </q-card-section>
    <!--
    <q-card-section class="row items-center q-py-sm">
      <q-icon size="xs" color="purple" name="fas fa-network-wired"></q-icon>
      <span class="text-subtitle1 q-mx-md">Tcp Bridge Port</span>
      <q-space />
      <span style="max-width: 100px">
        <q-input outlined dense v-model="bridgeport"></q-input>
      </span>
      <q-btn class="q-ml-sm" flat round size="sm" icon="fas fa-check" color="green" @click="updateBridgePort"></q-btn>
    </q-card-section>
    -->
    <q-card-section>
      <div>
        weather = weat, dust = dust
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
const db = remote.getGlobal('db')

export default {
  data () {
    return {
      serverport: '',
      bridgeport: ''
    }
  },
  async mounted () {
    const setup = await ipcRenderer.sendSync('getSetup')
    this.serverport = setup.serverPort
    this.bridgeport = setup.bridgePort
  },
  methods: {
    async updateServerPort () {
      const result = await db.update({ id: 'serverport' }, { $set: { value: this.serverport } }, { upsert: true })
      console.log(result)
    },
    async updateBridgePort () {
      const result = await db.update({ id: 'bridgeport' }, { $set: { value: this.bridgeport } }, { upsert: true })
      console.log(result)
    }
  }
}
</script>
