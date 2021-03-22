<template>
  <q-card flat>
    <q-card-section class="row items-center">
      <q-icon size="xs" name="fas fa-key"></q-icon>
      <span class="text-subtitle1 q-mx-md">외부 API</span>
      <q-space />
      <q-checkbox color="teal" v-model="checked"/>
    </q-card-section>

    <q-card-section v-if="checked" class="q-py-sm">
      <q-list class="q-py-sm">
        <q-item>
          <q-item-section>
            <q-item-label>기상청 key</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-input outlined dense></q-input>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round size="sm" icon="fas fa-sync-alt"></q-btn>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>에어코리아 측정소 key</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-input outlined dense></q-input>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round size="sm" icon="fas fa-sync-alt"></q-btn>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>에어코리아 key</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-input outlined dense></q-input>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round size="sm" icon="fas fa-sync-alt"></q-btn>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>에어코리아 key 인코딩</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-input outlined dense></q-input>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round size="sm" icon="fas fa-sync-alt"></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      checked: false
    }
  }
}
</script>
