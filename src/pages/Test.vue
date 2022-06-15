<template>
  <q-page class="flex flex-center">
    <h1>Test.vue</h1>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { ref } from 'vue'

export default defineComponent({
  name: 'Test',
  setup () {
    console.log('Hola');

    let limit = 1000000000;
    for (let index = 0; index <= limit ; index++) {
      Math.random() * Math.random();
      if (index==limit) {
        console.log('Limite alcanzado');
      }
    }

    console.log('Adios');
  }
})
</script>
