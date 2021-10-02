<template>
  <div>
	<h4 class="text-center q-ma-none">Platos</h4>
	<div class="q-py-md"></div>
	<div class="row no-wrap items-end">
	  <div class="col-8">
		<q-input ref="filterRef"  v-model="filter" label="Filter" >
		  <template v-slot:append>
		  <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
		  </template>
		</q-input>
	  </div>
	  <div class="col-4 q-ml-sm">
		<q-btn class="btnCollapseOpen" push dense color="primary" :label="collapseOpen" @click="toogleTree"/>
	  </div>
	</div>

	<div class="row q-mt-md">
	  <div class="col-12">
		<q-tree ref="tree"
		  :nodes="categories"
		  node-key="name"
		  label-key="name"
		  children-key="meals"
		  :v-model="expandedKeys"
		  :filter="filter"
		  default-expand>

		  <template v-slot:default-header="prop">
			<div>
			  <template v-if="(typeof prop.node.category_id) === 'undefined'">
				<span>{{ prop.node.name }}</span>
			  </template>
			  <template v-else>
				<draggable
				  :list="[prop]"
				  :item-key="prop.node.name"
				  @start="startDragging(prop.node)"
				  @end="endDragging"
				  :group="{ name: 'people', pull: 'clone', put: false }"
				>
				  <template #item="{ element }">
						<span 
							class="handle"
						>
						  {{ element.node.name }}
						</span>
				  </template>
				</draggable>
			  </template>
			</div>
		  </template>
		</q-tree>
	  </div>
	</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { api } from 'boot/axios';
import draggable from 'vuedraggable';

export default {
  name: 'TreeViewMeals',
  components: {
	draggable
  },
  setup () {
	/* const filter = ref('');
	const filterRef = ref(null); */
	const expandedKeys = ref([]);
	const isExpanded = ref(true);
	const dragging = ref(false);

	return {
	  /* filter,
	  filterRef, */
	  expandedKeys,
	  isExpanded,
	  dragging,
	}
  },
  data() {
	  return {
		  categories: [],
		  collapseOpen: "Cerrar todos",
		  filter: '',
		  //filterRef: null,
	  }
  },

  created() {
	console.log("Creado TreViewMeals");
  },

  mounted() {
	  this.getCategoriesDB();
  },

  /* watch: {
	  filter: function(){
		  if ( this.filter.length > 0 ) {
			  this.$refs.tree.expandAll();
		  }
	  }
  }, */

  methods: {

	getCategoriesDB(){
		api
			.get( process.env.API + 'categories' )
			.then(response => {
				this.categories = response.data.categories;
			});

	},

	toogleTree(){
	  if( this.$refs.tree.getExpandedNodes().length > 0 ){
		this.$refs.tree.collapseAll();
		this.collapseOpen = `Abrir\ntodos`;
	  }else{
		this.$refs.tree.expandAll();
		this.collapseOpen = "Cerrar\ntodos";
	  }
	},

	resetFilter () {
		this.filter = '';
		this.$refs.filterRef.focus();
	},

	
	startDragging( item ){
	  console.log( 'Start dragging Tree', item );
	//console.log( 'this.$parent.leftDrawerOpen', this.leftDrawerOpen_ );
	  //this.leftDrawerOpen_ = false;
		//console.log( 'this.$parent.leftDrawerOpen', this.leftDrawerOpen_ );

		//this.$emit('updateParent', this.$parent.leftDrawerOpen)
	  //this.$emit('update:currentItem', item);
	  this.$parent.currentItem = item;
	  console.log( 'Fin de Start dragging Tree', this.$parent.currentItem );
	},

	endDragging(){
	  console.log( 'End dragging Tree' );
	},

	addDragging(){
	  console.log( 'Add dragging Tree' );
	},

	mousedown (){
		console.log("mousedown");
	},
	mouseup (){
		console.log("mouseup");
	},

  },
}
</script>

<style lang="scss" scoped>

	.my-card{
		width: 100%;
		max-width: 250px;
		margin: 0.5rem 0;
	}

	.subtitle{
		font-size: 1rem;
		font-weight: 600;
	}

	.btnCollapseOpen{
		width:100%;
		white-space: pre-line;
		line-height: 1.2rem;
		min-height: 1rem;
	}

  .handle:hover{
	cursor: move;
  }

</style>