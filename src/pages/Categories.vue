<template>
	<q-page padding>
		<div id="app">
			<div class="q-pa-md">
				<q-table
					title="Platos"
					:rows="categories"
					:columns="columns"
					row-key="name"
					:filter="filter"
					:loading="loadingState"
				>
					<template v-slot:top>
						<q-btn color="primary" :disable="loadingState" label="Añadir categoría" @click="prompt = true" />
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
						<div class="text-h6">Nueva categoría</div>
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-input dense v-model="editedItem.name" label="Nombre" autofocus />
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-input dense type="number" label="Nº optimo por semana" v-model="editedItem.optimum_number" />
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
    label: 'Categoría',
    align: 'left',
    field: 'name',
	sortable: true,
  },
  { name: 'optimum_number', align: 'center', label: 'Nº optimo por semana', field: 'optimum_number', sortable: true },
];


export default {
	name: 'CategoriesPage',

	setup() {
		let categories   = ref([]);
		let loadingState = ref(true);
		let filter       = ref('');
		let prompt       = ref(false);
		let editedItem   = ref({
			id: '',
			name: '',
			optimum_number: '',
			parent_id: null,
		});
		let defaultItem  = {
			id: '',
			name: '',
			optimum_number: '',
			parent_id: null,
		};

		return {
			categories,
			loadingState,
			columns,
			filter,
			prompt,
			editedItem,
		};
	},
	data() {
		return {
			editedIndex: -1,
		}
	},
	mounted() {
		this.getCategories();
	},
	methods: {
		async getCategories(){
			this.loadingState = true;
			await api
				.get( process.env.API + 'categories' )
				.then(response => {
					this.categories = response.data.categories;
				});

			this.loadingState = false; 
		},
		
		async save () {
			if ( this.isNewItem() ) {
				this.newItemDB();
				this.categories.push( this.editedItem );
			} else {
				Object.assign( this.categories[ this.editedIndex ], this.editedItem );
				this.updateItemDB( this.editedItem );
			}

			this.close();
		},

		async updateItemDB( id ){
			await api
				.patch( process.env.API + 'categories/' + id )
				.then( response => {

				})
				.catch(error => {
					console.error(error);
				});
		},

		async newItemDB(){
			let headers = {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				};

			await api
				.post( process.env.API + 'categories/', this.editedItem, headers )
				.then( response => {
					this.editedItem.id = response.data.category.id;
				})
				.catch(error => {
					console.error(error);
				});
		},

		async deleteItemDB( id ){
			await api
				.delete( process.env.API + 'categories/' + id )
				.then( response => {

				})
				.catch(error => {
					console.error(error);
				});
		},

		isNewItem(){
			return this.editedIndex == -1;
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
