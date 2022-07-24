<template>
	<q-page padding>
		<div id="app">
			<div class="q-pa-md">
				<q-table 
					title="Categorias" 
					:rows="categories" 
					:columns="columns" 
					row-key="name" 
					:filter="filter" 
					:loading="loadingState"
					:rows-per-page-options="[0]"
				>
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
							Categorías
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
				<q-card style="min-width: 350px" @keyup.enter="save">
					<q-card-section>
						<div class="text-h6">Nueva categoría</div>
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-input 
							ref="editedItemName"
							dense
							v-model="editedItem.name"
							label="Nombre"
							autofocus />
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-select v-model="editedItem.icon" :options="icons" option-label="name" option-value="id" label="Selecciona icono">
							<template v-slot:selected>
								<div class="items-center">
									<q-icon class="q-mr-md" :name="editedItem.icon ? 'img:' + editedItem.icon.path : ''" />
									<span>{{ editedItem.icon ? editedItem.icon.name : '' }}</span> 
								</div>
							</template>
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
import { useStore } from 'vuex'
import { useQuasar } from "quasar";
import { getErrorMessage } from "../utils";

const columns = [
	{
		name: "name",
		label: "Nombre",
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
		const store = useStore();
		const $q = useQuasar();
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
			await 
				api.get(process.env.API + "categories", { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} } )
					.then((response) => {
						categories.value = response.data.categories;
						icons.value = response.data.icons;
					})
					.catch( (error) => {
						$q.notify({
							message: 'Error al cargar las categorías',
							type: "negative",
							position: "top-right",
						});
					} )
					.finally( () => {
						loadingState.value = false;
					} );
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
			$q.loading.show();
			await api
				.patch(process.env.API + "categories/" + editedItem.value.id, 
					{
						name: editedItem.value.name,
						icon_id: editedItem.value.icon.id,
						optimum_number: editedItem.value.optimum_number
					}, 
					{ headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
				.then((response) => {
					categories.value[editedIndex] = response.data;
					$q.notify({
						message: 'Actualizado correctamente',
						type: "positive",
						position: "top-right",
					});
					close();
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
					$q.loading.hide();
				} );
		};

		const newItemDB = async () => {
			$q.loading.show();
			await api
				.post(process.env.API + "categories", editedItem.value, { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
				.then((response) => {
					categories.value.push(response.data);
					close();
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
					$q.loading.hide();
				} );
		};

		const requestConfirmation = (item) => {
			editedItem.value = { ...item };
			dialogConfirm.value = true;
		};

		const deleteItemDB = async () => {
			$q.loading.show();
			await api
				.delete(process.env.API + "categories/" + editedItem.value.id, { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
				.then((response) => {
					categories.value = response.data;
					close();
				})
				.catch((error) => {
					debugger
					$q.notify({
						message: getErrorMessage( error ),
						type: "negative",
						position: "top-right",
						html: true
					});
				})
				.finally( () => {
					$q.loading.hide();
				} );;
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

<style lang="scss">
	.q-field__control-container .q-field__native{
		padding-bottom: 0;
	}
	
</style>