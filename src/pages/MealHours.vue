<template>
	<q-page padding>
		<div id="app">
			<div class="q-pa-md">
				<q-table title="Tipos" :rows="mealHours" :columns="columns" row-key="name" :filter="filter" :loading="loadingState">
					<template v-slot:top>
						<q-btn color="primary" :disable="loadingState" label="Añadir hora" @click="newItem" />
						<q-space />
						<q-input borderless dense debounce="300" color="primary" v-model="filter">
							<template v-slot:append>
								<q-icon name="search" />
							</template>
						</q-input>
					</template>
					<template v-slot:body="props">
						<q-tr :props="props">
							<q-td key="order" :props="props">
								{{ props.row.order }}
							</q-td>
							<q-td key="name" :props="props">
								{{ props.row.name }}
							</q-td>
							<q-td key="actions" :props="props">
								<q-icon @click="editItem(props.row)" name="edit" class="actionIcons" />
								<q-icon @click="requestConfirmation(props.row)" name="delete" class="actionIcons" />
							</q-td>
						</q-tr>
					</template>
				</q-table>
			</div>
		</div>
		<div>
			<q-dialog v-model="prompt" persistent>
				<q-card style="min-width: 350px">
					<q-card-section>
						<div class="text-h6">Nuevo horario</div>
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-input
							ref="editedItemName"
							dense
							v-model="editedItem.name"
							label="Nombre"
							autofocus
							:rules="[(val) => val.length >= 1 || 'Por favor, introduce un nombre']"
						/>
					</q-card-section>
					<q-card-section class="q-pt-none">
						<q-input
							dense
							v-model="editedItem.order"
							label="Orden"
							type="number"
							:rules="[
								(val) => val <= newOrder() || `El orden no puede ser superior a ${newOrder()}, por lo que se establecerá en ${newOrder()}`,
							]"
						/>
					</q-card-section>
					<q-card-actions align="right" class="text-primary">
						<q-btn flat label="Cancelar" @click="close" />
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
				<q-btn @click="close" flat label="Cancelar" />
				<q-btn @click="deleteItem" flat label="Confirmar" color="negative" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script>
import { ref, onBeforeMount, nextTick } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const columns = [
	{
		name: "order",
		label: "Orden",
		align: "left",
		field: "order",
		sortable: true,
	},
	{
		name: "name",
		label: "Horario",
		align: "left",
		field: "name",
		sortable: true,
	},
	{
		name: "actions",
		align: "right",
		label: "Actions",
		field: "actions",
		sortable: false,
	},
];

export default {
	name: "MealHours",
	setup() {
		const $q = useQuasar();
		let editedIndex = -1;
		let mealHours = ref([]);
		let loadingState = ref(true);
		let filter = ref("");
		let prompt = ref(false);
		let dialogConfirm = ref(false);
		let editedItemName = ref(null);

		let editedItem = ref({
			id: "",
			name: "",
			order: "",
		});

		let defaultItem = {
			id: "",
			name: "",
			order: "",
		};
		onBeforeMount(() => {
			getMealHours();
		});

		const getMealHours = async () => {
			loadingState.value = true;
			await api
				.get(process.env.API + "mealHours")
				.then((response) => {
					mealHours.value = response.data;
				})
				.catch((e) => {
					if (error.response.data.errors) {
						Object.values(error.response.data.errors).forEach((element) => {
							$q.notify({
								message: element,
								type: "negative",
								position: "top-right",
							});
						});
					} else {
						$q.notify({
							message: error.response.data.message,
							type: "negative",
							position: "top-right",
						});
					}
				});

			loadingState.value = false;
		};

		const newOrder = () => {
			if (mealHours.value.length > 0) {
				return (
					Math.max.apply(
						Math,
						mealHours.value.map(function (mh) {
							return mh.order;
						})
					) + 1
				);
			} else {
				return 1;
			}
		};

		const newItem = () => {
			prompt.value = true;
			editedItem.value.order = newOrder();
		};

		const save = async () => {
			if (!editedItemName.value.validate()) {
				return;
			}

			$q.loading.show();
			if (isNewItem()) {
				await api
					.post(process.env.API + "mealHours", editedItem.value)
					.then((response) => {
						if (response.status == 200) {
							mealHours.value = response.data;
							$q.notify({
								message: "Guardado correctamente",
								type: "positive",
								position: "top-right",
							});
						}
					})
					.catch((error) => {
						if (error.response.data.errors) {
							Object.values(error.response.data.errors).forEach((element) => {
								$q.notify({
									message: element,
									type: "negative",
									position: "top-right",
								});
							});
						} else {
							$q.notify({
								message: error.response.data.message,
								type: "negative",
								position: "top-right",
							});
						}
					});
			} else {
				await api
					.patch(process.env.API + "mealHours/" + editedItem.value.id, editedItem.value)
					.then((response) => {
						if (response.status == 200) {
							mealHours.value = response.data;

							$q.notify({
								message: "Actualizado correctamente",
								type: "positive",
								position: "top-right",
							});
						}
					})
					.catch((error) => {
						if (error.response.data.errors) {
							Object.values(error.response.data.errors).forEach((element) => {
								$q.notify({
									message: element,
									type: "negative",
									position: "top-right",
								});
							});
						} else {
							$q.notify({
								message: error.response.data.message,
								type: "negative",
								position: "top-right",
							});
						}
					});
			}

			close();
			$q.loading.hide();
		};

		const isNewItem = () => {
			return editedIndex == -1;
		};

		const close = async () => {
			prompt.value = false;
			dialogConfirm.value = false;
			await nextTick(() => {
				editedItem.value = Object.assign({}, defaultItem);
				editedIndex = -1;
			});
		};

		const editItem = (item) => {
			prompt.value = true;
			editedIndex = 0;
			editedItem.value = { ...item };
		};

		const deleteItem = async () => {
			$q.loading.show();
			await api
				.delete(`${process.env.API}mealHours/${editedItem.value.id}`)
				.then((response) => {
					if (response.status == 200) {
						mealHours.value = response.data;
					}
				})
				.catch((error) => {
					if (error.response.data.errors) {
						Object.values(error.response.data.errors).forEach((element) => {
							$q.notify({
								message: element,
								type: "negative",
								position: "top-right",
							});
						});
					} else {
						$q.notify({
							message: error.response.data.message,
							type: "negative",
							position: "top-right",
						});
					}
				});

			close();
			$q.loading.hide();
		};

		const requestConfirmation = (item) => {
			editedItem.value = { ...item };
			dialogConfirm.value = true;
		};

		return {
			mealHours,
			loadingState,
			columns,
			filter,
			prompt,
			editedItem,
			save,
			close,
			editItem,
			deleteItem,
			dialogConfirm,
			requestConfirmation,
			newItem,
			newOrder,
			editedItemName,
		};
	},
};
</script>
