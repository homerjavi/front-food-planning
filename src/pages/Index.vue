<template>
  <q-page class="q-pa-md">
	<div class="q-px-md q-py-lg q-gutter-sm">
		<div class="row">
			<div class="col-3">
				<button @click="toggleLeftDrawer">Ver platos</button>
				<q-drawer
					v-model="leftDrawerOpen"
					id="tree"
					ref="tree"
					show-if-above
					bordered
					class="bg-grey-1 "
				>
					<span>hossss</span>
					<tree-view-meals 
						@updateParent="toggleLeftDrawer" 
						v-touch-hold.mouse="mousedown"
						@mouseup="mouseup"
					/>
				</q-drawer>	
			</div>
			<div class="col-9 q-px-sm">
				<planning />
			</div>
		</div>
	</div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import TreeViewMeals from 'components/TreeViewMeals';
import Planning from 'components/Planning';
import Drawer from 'components/Drawer';

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
		  console.log("Mouse down");
		  this.lastEventMouse = "mousedown";
		  if( this.lastEventMouse == "mousedown" ) {
				this.leftDrawerOpen = false;
			}
			/* window.setTimeout(() => {
				  
			}, 1000); */
	  },
	  mouseup (){
		  console.log("Mouse up");
		  this.lastEventMouse = "mouseup";
	  },
  },	
})
</script>