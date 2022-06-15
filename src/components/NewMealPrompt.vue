<template>
    <div>
		<q-card style="min-width: 350px">
			<q-card-section>
				<div class="text-h6">{{ editedOrNewMealText }}</div>
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
				<q-input dense type="text" label="Receta" v-model="editedItem.recipe" />
			</q-card-section>
			<q-card-section class="q-pa-none">
				<div class="row justify-between">
					<q-card-section class="col-12 col-sm-6 q-pt-none">
						<q-input class="" dense type="number" label="Calorías" v-model="editedItem.kalories" />
					</q-card-section>
					<q-card-section class="col-12 col-sm-6 q-pt-none">
						<q-input class="" dense type="number" label="Tiempo (minutos)" v-model="editedItem.minutes" />
					</q-card-section>
				</div>
			</q-card-section>
			<q-card-section class="q-pt-sm">
				<span class="q-field__label q-pt-none" style="font-size: 14px;">Dificultad</span>
				<div class="flex">
					<q-rating
						v-model="editedItem.difficulty"
						size="2em"
						icon="star_border"
						color="blue"
						icon-selected="star"
						icon-half="star_half"
					/>
				</div>
			</q-card-section>
			<q-card-section class="q-pt-none">
				<q-input dense autogrow label="Descripción" v-model="editedItem.description" />
			</q-card-section>
			<q-card-actions align="right" class="text-primary">
				<q-btn flat label="Cancelar" v-close-popup />
				<q-btn flat label="Guardar" @click="save" />
			</q-card-actions>
		</q-card>
    </div>
</template>

<script>
import { api } from "boot/axios";
import { ref, onMounted, computed } from "vue";
export default {
  name: 'NewMealPrompt',
  props: [ 'edited_item', 'categories' ],
  setup ( props, { emit } ) {
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

    onMounted(() => {
		editedItem.value = props.edited_item;
	});

    /* const save = () => {
		emit("updateEditedItem", editedItem.value);
    }; */

	const editedOrNewMealText = computed( () => editedItem.value.id ? 'Editar plato' : 'Nuevo plato' );

	const isNewItem = () => {
		return !editedItem.value.id;
	};

	const save = () => {
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
				// meals.value[editedIndex] = response.data;
				emit("updatedItem", response.data);
			})
			.catch((error) => {
				console.error(error);
			});

		// close();
	};

	const newItemDB = async () => {
		await api
			.post(process.env.API + "meals", editedItem.value)
			.then((response) => {
				emit("addedItem", response.data);
				// meals.value.push(response.data);
			})
			.catch((error) => {
				console.error(error);
			});

		// close();
	};

	/* const close = async () => {
		prompt.value = false;
		dialogConfirm.value = false;

		await nextTick(() => {
			editedItem.value = { ...defaultItem };
			editedIndex = -1;
		});
	}; */

    return {
      save, editedItem, editedOrNewMealText
    }
  },
}
</script>
