<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black">
      <div class="fit row no-wrap items-center">
      <div class="fit row no-wrap justify-center items-center nav q-pa-md">
        <div class="text-center nav">
          <router-link class="q-mx-sm text-subtitle1" to="/">Home</router-link>
          <span>|</span>
          <router-link class="q-mx-sm text-subtitle1" to="/setup">Setup</router-link>
        </div>
      </div>
      <div class="q-mr-md">
        <q-btn
          round
          flat
          size="sm"
          icon="fas fa-sync-alt"
          @click="getAll"
        ></q-btn>
      </div>
    </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import mainFun from '../mixins/query'
import moment from 'moment'

export default {
  name: 'MainLayout',
  mixins: [mainFun],
  mounted () {
    setInterval(() => {
      const currTime = moment().format('mm')
      console.log(currTime)
      if (currTime === '45') {
        this.getWeather()
      } else if (currTime === '20') {
        this.getDust()
      }
    }, 60000)
  },
  data () {
    return {
      //
    }
  }
}
</script>

<style>
.nav a {
  font-weight: bold;
  color: #2c3e50;
}

.nav a.router-link-exact-active {
  color: #42b983;
}
</style>
