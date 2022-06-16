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
					<template v-slot:top>
						<q-btn color="primary" :disable="loadingState" label="Añadir plato" @click="editItem" />
						<q-space />
						<q-input borderless dense debounce="300" color="primary" v-model="filter">
							<template v-slot:append>
								<q-icon name="search" />
							</template>
						</q-input>
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

const columns = [
	{
		name: "name",
		id: "id",
		label: "Platos",
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
			console.log( mealsTable.value );
		});

		/* const onUpdateEditedItem = ( editedItem ) => {
			editedItem.value = { ...editedItem };
			save();
		}; */

		const getMeals = () => {
			loadingState.value = true;
			api.get(process.env.API + "meals").then((response) => {
				meals.value = response.data;
			}).finally(() => loadingState.value = false);
		};

		const getCategories = () => {
			loadingState.value = true;
			api.get(process.env.API + "categories").then((response) => {
				categories.value = response.data.categories;
			}).finally(() => loadingState.value = false);
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
			// meals.value = items;
			customOrder();
			close();
		}

		/* const save = () => {
			if (isNewItem()) {
				newItemDB();
			} else {
				updateItemDB();
			}
		};

		const updateItemDB = async () => {
			await api
				.patch(process.env.API + "meals/" + editedItem.value.id, editedItem.value)
				.then((response) => {
					meals.value[editedIndex] = response.data;
				})
				.catch((error) => {
					console.error(error);
				});

			close();
		};

		const newItemDB = async () => {
			debugger;
			await api
				.post(process.env.API + "meals", editedItem.value)
				.then((response) => {
					meals.value.push(response.data);
				})
				.catch((error) => {
					console.error(error);
				});

			close();
		}; */

		const requestConfirmation = (item) => {
			editedItem.value = { ...item };
			dialogConfirm.value = true;
		};

		const deleteItemDB = async () => {
			await api
				.delete(process.env.API + "meals/" + editedItem.value.id)
				.then((response) => {
					meals.value = response.data;
				})
				.catch((error) => {
					console.error(error);
				});

			close();
		};

		const isNewItem = () => {
			return !editedItem.value.id;
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
				// sortBy = "\"category['name']\", \"name\"";
				sortBy         = ["category['name']", 'name'];
				orderAscOrDesc = [orderAscOrDesc, 'asc'];
				// orderAscOrDesc = "\"" + orderAscOrDesc + "\", \"asc\"";
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
			// save,
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
