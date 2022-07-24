<template>
    <div>
		<q-card style="min-width: 350px" @keyup.enter="save">
			<q-card-section>
				<div class="text-h6">{{ editedOrNewMealText }}</div>
			</q-card-section>
			<q-card-section class="q-pt-none">
				<div class="row justify-between">
					<q-card-section class="col-10 q-pa-none">
						<q-input dense v-model="editedItem.name" label="Nombre" autofocus />
					</q-card-section>
					<q-card-section class="col-2 q-pa-none text-right">
						<q-btn
							size="16px"
							flat
							:icon="iconProperties.name"
							:color="iconProperties.color"
							class="q-pa-none"
							@click="toggleFavorite">
						</q-btn>
					</q-card-section>
				</div>
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
import { useStore } from 'vuex'
import { useQuasar } from "quasar";
import { getErrorMessage } from "../utils";

export default {
  name: 'NewMealPrompt',
  props: [ 'edited_item', 'categories' ],
  setup ( props, { emit } ) {
	const store = useStore();
	const $q = useQuasar();
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
			favorite: 0,
		});
	let iconProperties = ref({
		name: '',
		color: '',
	});
	let loadingState = ref(true);

    onMounted(() => {
		editedItem.value = props.edited_item;
		setIconProperties();
	});

	const setIconProperties = () => {
		if ( editedItem.value.favorite ) {
			iconProperties.value.name  = 'favorite';
			iconProperties.value.color = 'red';
		} else {
			iconProperties.value.name  = 'favorite_border';
			iconProperties.value.color = 'none';
		}
	}

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
		$q.loading.show();
		loadingState.value = true;
		await api
			.patch(process.env.API + "meals/" + editedItem.value.id, 
				{
					name: editedItem.value.name,
					description: editedItem.value.description,
					category_id: editedItem.value.category.id,
					difficulty: editedItem.value.difficulty,
					minutes: editedItem.value.minutes,
					kalories: editedItem.value.kalories,
					recipe: editedItem.value.recipe,
					favorite: editedItem.value.favorite,
				},
				{ headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
			.then((response) => {
				emit("updatedItem", response.data);
				$q.notify({
					message: "Actualizado correctamente",
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
	};

	const newItemDB = async () => {
		$q.loading.show();
		loadingState.value = true;
		await api
			.post(process.env.API + "meals", 
				{
					name: editedItem.value.name,
					description: editedItem.value.description,
					category_id: editedItem.value.category?.id,
					difficulty: editedItem.value.difficulty,
					minutes: editedItem.value.minutes,
					kalories: editedItem.value.kalories,
					recipe: editedItem.value.recipe,
					favorite: editedItem.value.favorite,
				},
				{ headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
			.then((response) => {
				emit("addedItem", response.data);
				$q.notify({
					message: "Guardado correctamente",
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
			.finally(() => { 
				loadingState.value = false; 
				$q.loading.hide();
			});
	};

	const toggleFavorite = () => {
		editedItem.value.favorite = !editedItem.value.favorite;
		setIconProperties();
	};

    return {
      save, editedItem, editedOrNewMealText, toggleFavorite, iconProperties
    }
  },
}
</script>
