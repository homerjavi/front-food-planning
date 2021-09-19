<template>
	<q-page padding>
		<div id="app">
			<div class="q-pa-md">
				<q-table
					title="Platos"
					:rows="meals"
					:columns="columns"
					row-key="name"
					:filter="filter"
					:loading="loadingState"
				>
					<template v-slot:top>
						<q-btn color="primary" :disable="loadingState" label="Añadir plato" @click="prompt = true" />
						<q-space />
						<q-input borderless dense debounce="300" color="primary" v-model="filter">
						<template v-slot:append>
							<q-icon name="search" />
						</template>
						</q-input>
					</template>
				</q-table>
			</div>
		</div>
		<div>
			<q-dialog v-model="prompt">
				<q-card style="min-width: 350px">
					<q-card-section>
						<div class="text-h6">Nuevo plato</div>
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-input dense v-model="editedItem.name" label="Nombre" autofocus />
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-select v-model="editedItem.category" :options="categories" label="Categoría" option-label="name" option-value="id"/>
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-input dense type="textarea" label="Descripción" v-model="editedItem.description" />
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-input dense type="number" label="Calorías" v-model="editedItem.kalories" />
					</q-card-section>

					<q-card-actions align="right" class="text-primary">
						<q-btn flat label="Cancelar" v-close-popup />
						<q-btn flat label="Guardar" @click="save" />
					</q-card-actions>
				</q-card>
			</q-dialog>
		</div>
	</q-page>
</template>

<script>
import { api } from 'boot/axios';
import { ref } from "vue";

const columns = [
  {
    name: 'name',
    label: 'Platos',
    align: 'left',
    field: 'name',
	sortable: true,
  },
  { name: 'category_id', align: 'center', label: 'Categoría', field: row => row.category.name, sortable: true },
  { name: 'kalories', align: 'center', label: 'Calories', field: 'kalories', sortable: true },
];


export default {
	name: 'MealsPage',

	setup() {
		let loadingState = ref(true);
		let filter       = ref('');
		let prompt       = ref(false);
		let editedIndex = -1;
		let editedItem = ref({
			id: '',
			name: '',
			description: '',
			category: {
				id: '',
				name: '',
				optimum_number: '',
				parent_id: null,
			},
			difficulty: 0,
			minutes: '',
			kalories: '',
			recipe: '',
		});
		let defaultItem = ref({
			id: '',
			name: '',
			description: '',
			category: {
				id: '',
				name: '',
				optimum_number: '',
				parent_id: null,
			},
			difficulty: 0,
			minutes: '',
			kalories: '',
			recipe: '',
		});

		return {
			loadingState,
			columns,
			filter,
			prompt,
			editedItem,
		};
	},
	data() {
		return {
			meals: [],
			categories: [],
		}
	},
	mounted() {
		this.getMeals();
		this.getCategories();
	},
	methods: {
		getMeals(){
			this.loadingState = true;
			api
				.get( process.env.API + 'meals' )
				.then(response => {
					this.meals = response.data;

				});

			this.loadingState = false; 
		},

		getCategories(){
			this.loadingState = true;
			api
				.get( process.env.API + 'categories' )
				.then(response => {
					this.categories = response.data.categories;
				});

			this.loadingState = false; 
		},
		
		async save () {
			if ( this.editedIndex > -1 ) {
				Object.assign( this.meals[ this.editedIndex ], this.editedItem );
				this.updateItemDB( this.editedItem );
			} else {
				this.newItemDB();
				this.meals.push( this.editedItem );
			}
			this.close();
		},

		async updateItemDB( id ){
			await api
				.patch( process.env.API + 'meals/' + id )
				.then( response => {

				})
				.catch(error => {
					console.error(error);
				});
		},

		async newItemDB(){
			await api
				.post( process.env.API + 'meals/', this.editedItem )
				.then( response => {
					this.editedItem.id = response.data.meal.id;
				})
				.catch(error => {
					console.error(error);
				});
		},

		async deleteItemDB( id ){
			await api
				.delete( process.env.API + 'meals/' + id )
				.then( response => {

				})
				.catch(error => {
					console.error(error);
				});
		},

		close () {
			this.prompt = false;
			this.$nextTick(() => {
				this.editedItem  = Object.assign( {}, this.defaultItem )
				this.editedIndex = -1
			});
		},
	},
}
</script>
