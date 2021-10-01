<template>
	<div>
  <q-drawer
      v-model="isOpen"
	    show-if-above
      bordered
      class="bg-grey-1"
    >

      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menú
        </q-item-label>

       <!--  <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->
      </q-list>
    </q-drawer>
	</div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Drawer',
  /* props:  {
	  isOpen: Boolean,
  },
 */
props: [ 'leftDrawerOpen' ],
  /* setup ( props ) {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen: props.isOpen,
    }
  }, */

  data() {
	  return {
		  isOpen: false,
	  }
  },
  watch: {
	  leftDrawerOpen: function () {
		  this.isOpen = this.leftDrawerOpen;
    }
  },
  created() {
    this.isOpen = this.leftDrawerOpen;
  },

})
</script>
