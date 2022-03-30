<template>
	<q-page padding>
		<div id="app">
			<div class="q-pa-md">
				<q-table title="Platos" :rows="meals" :columns="columns" row-key="name" :filter="filter" :loading="loadingState" :rows-per-page-options="[0]">
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
				<q-card style="min-width: 350px">
					<q-card-section>
						<div class="text-h6">Nuevo plato</div>
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-input dense v-model="editedItem.name" label="Nombre" autofocus />
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-select v-model="editedItem.category" :options="categories" label="Categoría" option-label="name" option-value="id">
							<template v-slot:option="scope">
								<q-item v-bind="scope.itemProps">
									<q-item-section avatar>
										<q-icon :name="scope.opt.icon.path ? 'img:' + scope.opt.icon.path : ''" />
									</q-item-section>
									<q-item-section>
										<q-item-label>{{ scope.opt.name }}</q-item-label>
									</q-item-section>
								</q-item>
							</template>
						</q-select>
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
import { ref, nextTick, onMounted } from "vue";

const columns = [
	{
		name: "name",
		label: "Platos",
		align: "left",
		field: "name",
		sortable: true,
	},
	{
		name: "category_id",
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

	setup() {
		let editedIndex = -1;
		let meals = ref([]);
		let categories = ref([]);
		let loadingState = ref(true);
		let filter = ref("");
		let prompt = ref(false);
		let dialogConfirm = ref(false);

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
			api.get(process.env.API + "meals").then((response) => {
				meals.value = response.data;
			});

			loadingState.value = false;
		};

		const getCategories = () => {
			loadingState.value = true;
			api.get(process.env.API + "categories").then((response) => {
				categories.value = response.data.categories;
			});

			loadingState.value = false;
		};

		const editItem = (item = null, index = null) => {
			editedItem.value = item ? { ...item } : { defaultItem };
			editedIndex = index ?? -1;
			prompt.value = true;
		};

		const save = async () => {
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
			await api
				.post(process.env.API + "meals", editedItem.value)
				.then((response) => {
					meals.value.push(response.data);
				})
				.catch((error) => {
					console.error(error);
				});

			close();
		};

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

		return {
			meals,
			categories,
			loadingState,
			columns,
			filter,
			prompt,
			editedItem,
			editItem,
			save,
			close,
			dialogConfirm,
			deleteItemDB,
			requestConfirmation,
		};
	},
};
</script>
