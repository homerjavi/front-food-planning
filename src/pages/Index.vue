<template>
  <q-page class="q-pa-md">
	<div class="q-py-lg">
		<q-drawer
			v-model="leftDrawerOpen"
			id="tree"
			ref="tree"
			show-if-above
			bordered
			class="bg-grey-1 q-pa-md"
		>
			<tree-view-meals 
				@updateParent="toggleLeftDrawer" 
				v-touch-hold.mouse="mousedown"
				@mouseup="mouseup"
			/>
		</q-drawer>	
		<div class="row">
			<div class="col-12 q-px-sm">
				<planning />
			</div>
		</div>
	</div>
	<q-page-sticky position="bottom-right" :offset="[18, 18]">
		<q-btn fab icon="add" color="primary" @click="toggleLeftDrawer"/>
	</q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import TreeViewMeals from 'components/TreeViewMeals';
import Planning from 'components/Planning';

export default defineComponent({
  name: 'PageIndex',
  components: {
	   TreeViewMeals, 
	  Planning
  },
  data() {
	  return {
		  currentItem: {},
		  leftDrawerOpen: false,
		  lastEventMouse: '',
	  }
  },
  created() {

  },
  mounted() {
	  
  },
  methods: {
	  toggleLeftDrawer () {
			this.leftDrawerOpen = !this.leftDrawerOpen;
		},
	  mousedown (){
		  this.lastEventMouse = "mousedown";
		  if( this.lastEventMouse == "mousedown" ) {
				this.leftDrawerOpen = false;
			}
	  },
	  mouseup (){
		  console.log("Mouse up");
		  this.lastEventMouse = "mouseup";
	  },
  },	
})
</script>