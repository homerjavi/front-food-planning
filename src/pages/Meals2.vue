<template>
  <q-page class="flex flex-center">
    <h1>Hoooola</h1>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { ref } from 'vue'

export default defineComponent({
  name: 'Meals2',
  setup () {
    const filter = ref('')
    const filterRef = ref(null)

    return {
      filter,
      filterRef,
      expandedKeys,

      simple: [
        {
          label: 'Satisfied customers',
          children: [
            {
              label: 'Good food',
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' }
              ]
            },
            {
              label: 'Good service (disabled node)',
              disabled: true,
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Pleasant surroundings',
              children: [
                { label: 'Happy atmosphere' },
                { label: 'Good table presentation' },
                { label: 'Pleasing decor' }
              ]
            }
          ]
        }
      ],

      resetFilter () {
        filter.value = ''
        filterRef.value.focus()
      }
    }
  }
})
</script>
