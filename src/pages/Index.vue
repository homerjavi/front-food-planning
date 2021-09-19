<template>
  <q-page class="q-pa-md">
	  <h1>{{ process.env.API_BASE_URL }}</h1>
	<div class="q-px-md q-py-lg q-gutter-sm">
		<div class="row">
			<div class="col-3">
				<tree-view-meals v-model:currentItem="currentItem"/>
			</div>
			<div class="col-9 q-px-xl ">
				<planning v-model:currentItem="currentItem"/>
			</div>
		</div>
	</div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import TreeViewMeals from 'components/TreeViewMeals';
import Planning from 'components/Planning';

export default defineComponent({
  name: 'PageIndex',
  components: {
	  TreeViewMeals, Planning
  },
  setup () {
  }, 
  data() {
	  return {
		  currentItem: {},
	  }
  },
  methods: {
  },
})
</script>