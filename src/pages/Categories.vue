<template>
	<q-page padding>
		<div id="app">
			<div class="q-pa-md">
				<q-table title="Categorias" :rows="categories" :columns="columns" row-key="name" :filter="filter" :loading="loadingState">
					<template v-slot:top>
						<q-btn color="primary" :disable="loadingState" label="Añadir categoría" @click="editItem" />
						<q-space />
						<q-input borderless dense debounce="300" color="primary" v-model="filter">
							<template v-slot:append>
								<q-icon name="search" />
							</template>
						</q-input>
					</template>
					<template v-slot:body-cell-icon="props">
						<q-td :props="props">
							<q-icon :name="'img:' + props.row.icon.path" class="actionIcons" />
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
				<q-card style="min-width: 350px">
					<q-card-section>
						<div class="text-h6">Nueva categoría</div>
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-input dense v-model="editedItem.name" label="Nombre" autofocus />
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-select v-model="editedItem.icon" :options="icons" option-label="name" option-value="id" clearable label="Selecciona icono">
							<template v-slot:option="scope">
								<q-item v-bind="scope.itemProps">
									<q-item-section avatar>
										<q-icon :name="'img:' + scope.opt.path" />
									</q-item-section>
									<q-item-section>
										<q-item-label>{{ scope.opt.name }}</q-item-label>
									</q-item-section>
								</q-item>
							</template>
						</q-select>
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
		label: "Categoría",
		align: "left",
		field: "name",
		sortable: true,
	},
	{
		name: "icon",
		label: "Icono",
		align: "left",
		field: "icon",
		sortable: false,
	},
	{
		name: "optimum_number",
		align: "center",
		label: "Nº optimo por semana",
		field: "optimum_number",
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
	name: "CategoriesPage",

	setup() {
		let editedIndex = -1;
		let categories = ref([]);
		let icons = ref([]);
		let loadingState = ref(true);
		let filter = ref("");
		let prompt = ref(false);
		let dialogConfirm = ref(false);

		let editedItem = ref({
			id: "",
			name: "",
			icon: "",
			optimum_number: "",
			parent_id: null,
		});

		let defaultItem = {
			id: "",
			name: "",
			icon: "",
			optimum_number: "",
			parent_id: null,
		};

		onMounted(() => {
			getCategories();
		});

		const getCategories = async () => {
			loadingState.value = true;
			await api.get(process.env.API + "categories").then((response) => {
				categories.value = response.data.categories;
				icons.value = response.data.icons;
			});

			loadingState.value = false;
		};

		const editItem = (item = null, index = null) => {
			editedItem.value = item ? { ...item } : { defaultItem };
			editedIndex = index ? index : -1;
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
				.patch(process.env.API + "categories/" + editedItem.value.id, editedItem.value)
				.then((response) => {
					categories.value[editedIndex] = response.data;
				})
				.catch((error) => {
					console.error(error);
				});

			close();
		};

		const newItemDB = async () => {
			await api
				.post(process.env.API + "categories", editedItem.value)
				.then((response) => {
					categories.value.push(response.data);
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
				.delete(process.env.API + "categories/" + editedItem.value.id)
				.then((response) => {
					categories.value = response.data;
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
			categories,
			icons,
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
