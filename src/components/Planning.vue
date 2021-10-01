<template>
  <div>
	  <button @click="seeAllPlanningInConsole">See All Planning</button>
	  <button @click="deleteAllPlanning">Delete All Planning</button>
    <h4 class="text-center q-ma-none">Planning</h4>
	<div class="q-py-md"></div>
	<div class="row">
		<q-card class="col-xs-5 my-card" v-for="(day, dayOfWeek) in planning" :key="`day-${dayOfWeek}`">
			<div color="primary" class="full-width text-white text-center text-h5 q-pa-sm bg-primary">
				{{ day.name }}
			</div>
			<q-separator />
			<div class="subtitle text-center">Comida</div>
			<q-card-section>
				<draggable
					:list="day['lunch']"
					:item-key="`${day.name}-lunch`"
					group="people"
					@add="handleAddMeal(day['lunch'], dayOfWeek, 'lunch')"
					@change="changeDragging">
					<template #item="{ element }">
						<div class="handle">
							{{ element.name }}
						</div>
					</template>
				</draggable> 
			</q-card-section>
			<q-separator class="q-my-sm"/>
			<div class="subtitle text-center">Cena</div>
			<q-card-section>
				<draggable
					:list="day['dinner']"
					:item-key="`${day.name}-lunch`"
					group="people"
					@add="handleAddMeal(day['dinner'], dayOfWeek, 'dinner')"
					@start="startDragging()"
					@end="endDragging()"
					@change="changeDragging"
					>
					<template #item="{ element }">
						<div class="handle">{{ element.name }}</div>
					</template>
				</draggable> 
			</q-card-section>
		</q-card>
	</div>
  </div>
</template>

<script>
import { ref } from "vue";
import { api } from 'boot/axios';
import draggable from 'vuedraggable';
// import Drawer from 'components/Drawer';

export default {
  name: 'Planning',

  components: {
	  draggable, /* Drawer */
  },

  //props: [ 'currentItem' ],

  setup () {
	let planning = ref({});
	//const leftDrawerOpen = ref(true)

	return {
		planning,
	}
  },

  data() {
	  return {
		  leftDrawerOpen: false,
		  planning_: {},
		  dra: [],
		  item: this.$parent.currentItem,
		  /* this.$parent.currentItem: {}, */
	  }
  },

 /*  watch: {
	currentItem: function () {
      this.$parent.currentItem = {...this.currentItem};
	},
  },
 */
  mounted() {
	this.getPlanningDB();
  },

  methods: {
	toggleLeftDrawer () {
		console.log(this.leftDrawerOpen);
		this.leftDrawerOpen = !this.leftDrawerOpen;
	},
	getPlanningDB() {
		api
			.get( process.env.API + 'planning' )
			.then(response => {
				this.planning = response.data.planning;
			});

	},

	startDragging(e){
		console.log( 'Start dragging Planning', e );
	},

	changeDragging(e){
		console.log( 'Change dragging Planning', e );

		if(!this.isEventAdded(e)){
			let element = e.removed.element;
			this.planning[element.day_of_week][element.hour] = this.planning[element.day_of_week][element.hour].splice(e.removed.oldIndex, 1);
			
			if (element.id) {
				this.deleteMealDB( element.id );
			}

			return;
		}

		this.$parent.currentItem = this.isMovedFromPlanning(e) ? {...e.added.element} : {...e.added.element.node};
		this.$parent.currentItem.order = e.added.newIndex + 1;
	},

	handleAddMeal(target, dayOfWeek, hour) {
		console.log( 'HandleAddMeal dragging Planning', arguments );
		console.log( 'HandleAddMeal dragging Planning Target', target );
		this.$parent.currentItem.day_of_week = dayOfWeek;
		this.$parent.currentItem.hour      = hour;
		
		target[this.$parent.currentItem.order-1] = {...this.$parent.currentItem};
		this.saveMealDB();
	},

	async saveMealDB( item ) {
		await api
				.post(process.env.API + 'planning', this.$parent.currentItem)
				.then( (response) => {
					let savedPlanning   = response.data.planning;
					let targetPlanning  = this.planning[ savedPlanning.day_of_week ][ savedPlanning.hour ][ savedPlanning.order - 1 ];
					targetPlanning.id   = savedPlanning.id;
					targetPlanning.date = savedPlanning.date;
					targetPlanning.type = savedPlanning.type;
				})
				.catch(error => {
					console.log(error);
				});
	},

	async deleteMealDB( id ) {
		await api
			.delete( process.env.API + 'planning/' + id )
			.then( response => {

			})
			.catch(error => {
				console.error(error);
			});
	},

	deleteDuplicateItems(target) {
		target.forEach( (element, index) => {
			if (element.hasOwnProperty('node') ) {
				target.splice(index, 1);
			}
		});
	},

	
	endDragging(e){
		console.log( 'End dragging Planning', e );
	},
	addDragging(event){
	  console.log( 'Add dragging Planning', event );
	},
	
	isMovedFromPlanning(e){
		return !e.added.element.hasOwnProperty('key');
	},
	isEventAdded(e){
		return e.hasOwnProperty('added');
	},

	seeAllPlanningInConsole(){
		console.log( "All Planning", this.planning );
	},

	async deleteAllPlanning() {
		await api
				.delete( process.env.API + 'delete-all-planning' )
				.then( response => {
					this.planning = response.data.planning;
				})
				.catch(error => {
					console.error(error);
				});
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
	
	.bloque{
		height: 200px;
		background-color: red;
	}

	.handle:hover{
		cursor: move;
	}
</style>