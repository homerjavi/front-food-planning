<template>
	<q-page padding>
		<div id="app">
			<div class="q-pa-md">
				<q-table 
					id="mealsTable"
					ref="mealsTable"
					title="Platos"
					:rows="meals"
					:columns="columns"
					row-key="id"
					:filter="filter"
					:loading="loadingState"
					:rows-per-page-options="[0]"
					no-data-label="Sin datos"
					:sort-method="customOrder"
					binary-state-sort>
					<template #header-cell="props">
						<q-th
							class="text-primary"
							:props="props"
						>
							{{ props.col.label }}
						</q-th>
					</template>
					<template #top-left>
						<div
							class="text-bold"
							style="font-size: 1.3em;"
						>
							Platos
						</div>
					</template>
					<template #top-right>
						<q-btn class="q-mr-md" color="primary" :disable="loadingState" label="Añadir categoría" @click="editItem" />
						<q-input outlined dense debounce="300" color="primary" v-model="filter">
							<template v-slot:append>
								<q-icon name="search" />
							</template>
						</q-input>
					</template>
					<template v-slot:body-cell-favorite="props">
						<q-td :props="props">
							<q-icon 
								size="16px"
								:name="props.row.favorite ? 'favorite' : 'favorite_border'"
								:color="props.row.favorite ? 'red' : 'none'"
							/>
						</q-td>
					</template>
					<template v-slot:body-cell-action="props">
						<q-td key="action" :props="props">
							<q-icon name="edit" class="actionIcons" @click="editItem(props.row, props.rowIndex)" />
							<q-icon name="delete" class="actionIcons" @click="requestConfirmation(props.row)" />
						</q-td>
					</template>
				</q-table>
			</div>
		</div>
		<div>
			<q-dialog v-model="prompt">
			<new-meal-prompt 
				:edited_item='editedItem' 
				:categories='categories' 
				@updatedItem="onUpdatedItem"
				@addedItem="onAddedItem"
			/>
			</q-dialog>
		</div>
	</q-page>
	<q-dialog v-model="dialogConfirm" persistent>
		<q-card>
			<q-card-section class="row items-center">
				<q-avatar icon="delete" color="primary" text-color="white" />
				<span class="q-ml-sm">¿Estás seguro que quieres eliminarlo?</span>
			</q-card-section>

			<q-card-actions align="right">
				<q-btn @click="close" label="Cancelar" />
				<q-btn @click="deleteItemDB" label="Confirmar" color="negative" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script>
import { api } from "boot/axios";
import { ref, nextTick, inject, onMounted } from "vue";
import NewMealPrompt from "components/NewMealPrompt.vue";
import { useStore } from 'vuex'
import { useQuasar } from "quasar";
import { getErrorMessage } from "../utils";

const columns = [
	{
		name: "name",
		id: "id",
		label: "Nombre",
		align: "left",
		field: "name",
		sortable: true,
	},
	{
		name: "category",
		align: "center",
		label: "Categoría",
		field: (row) => row.category.name,
		sortable: true,
	},
	{
		name: "favorite",
		align: "center",
		label: "Favorite",
		field: "favorite",
		sortable: true,
	},
	{
		name: "kalories",
		align: "center",
		label: "Calories",
		field: "kalories",
		sortable: true,
	},
	{
		name: "action",
		align: "right",
		label: "Action",
		field: "action",
	},
];

export default {
	name: "MealsPage",

	components: {
		NewMealPrompt,
	},

	setup() {
		const store = useStore();
		const $q = useQuasar();
		const emitter = inject("emitter");
		let editedIndex = -1;
		let meals = ref([]);
		let categories = ref([]);
		let loadingState = ref(true);
		let filter = ref("");
		let prompt = ref(false);
		let dialogConfirm = ref(false);
		let mealsTable = ref(null);
		let lastOrder = {
			sortBy: 'name',
			descending: false
		};

		let editedItem = ref({
			id: "",
			name: "",
			description: "",
			category: {
				id: "",
				name: "",
				optimum_number: "",
				parent_id: null,
			},
			difficulty: 0,
			minutes: "",
			kalories: "",
			recipe: "",
		});

		let defaultItem = {
			id: "",
			name: "",
			description: "",
			category: {
				id: "",
				name: "",
				optimum_number: "",
				parent_id: null,
			},
			difficulty: 0,
			minutes: "",
			kalories: "",
			recipe: "",
		};

		onMounted(() => {
			getMeals();
			getCategories();
		});

		const getMeals = () => {
			loadingState.value = true;
			api
				.get(process.env.API + "meals", { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
				.then((response) => {
					meals.value = response.data;
				})
				.catch ( () => {
					$q.notify({
						message: "Error al cargar los platos",
						type: "negative",
						position: "top-right",
						html: true
					});
				} )
				.finally( () => { 
					loadingState.value = false;
				});
		};

		const getCategories = () => {
			loadingState.value = true;
			api
				.get(process.env.API + "categories", { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
				.then((response) => {
					categories.value = response.data.categories;
				})
				.catch( () => {
					$q.notify({
						message: "Error al cargar las categorías",
						type: "negative",
						position: "top-right",
						html: true
					});
				})
				.finally( () => { 
					loadingState.value = false;
				});
		};

		const editItem = (item = null, index = null) => {
			editedItem.value = item ? { ...item } : { ...defaultItem };
			editedIndex = index ?? -1;
			prompt.value = true;
		};

		const onUpdatedItem = ( item ) => 
		{
			let index = meals.value.findIndex( meal => meal.id == item.id )
			meals.value[index] = {...item};
			close();
		}

		const onAddedItem = ( item ) => 
		{
			meals.value.push( item );
			customOrder();
			close();
		}

		const requestConfirmation = (item) => {
			editedItem.value = { ...item };
			dialogConfirm.value = true;
		};

		const deleteItemDB = async () => {
			$q.loading.show();
			loadingState.value = true;
			await api
				.delete(process.env.API + "meals/" + editedItem.value.id, { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
				.then((response) => {
					meals.value = response.data;
					$q.notify({
						message: "Eliminado correctamente",
						type: "positive",
						position: "top-right",
					});
				})
				.catch((error) => {
					$q.notify({
						message: getErrorMessage( error ),
						type: "negative",
						position: "top-right",
						html: true
					});
				})
				.finally( () => { 
					loadingState.value = false;
					$q.loading.hide();
				});


			close();
		};

		const close = async () => {
			prompt.value = false;
			dialogConfirm.value = false;

			await nextTick(() => {
				editedItem.value = { ...defaultItem };
				editedIndex = -1;
			});
		};

		const customOrder = ( data = meals.value, sortBy = lastOrder.sortBy, descending = lastOrder.descending) => {
			lastOrder = {
				sortBy,
				descending
			};
			
			let orderAscOrDesc = descending ? 'desc' : 'asc';
			
			if(sortBy == 'category') {
				sortBy         = ["category['name']", 'name'];
				orderAscOrDesc = [orderAscOrDesc, 'asc'];
			} else{
				sortBy         = [ sortBy ];
				orderAscOrDesc = [ orderAscOrDesc ];
			}

			data = _.orderBy(data, sortBy, orderAscOrDesc);
			
			return data; 
		};

		return {
			meals,
			categories,
			loadingState,
			columns,
			filter,
			prompt,
			editedItem,
			editItem,
			close,
			dialogConfirm,
			deleteItemDB,
			requestConfirmation,
			onAddedItem,
			onUpdatedItem,
			mealsTable,
			customOrder
		};
	},
};
</script>
