<template>
	<div>
		<h3 class="text-center q-mt-none q-mb-md">Planning</h3>
		<!-- <button @click="showResume = !showResume">Ver resumen</button> -->
		<div class="row q-pa-md justify-between">
			<q-toggle class="col" v-model="showResume" label="Ver resumen" />
			<q-btn-group push class="col" style="max-width: 400px;">
				<q-btn class="col q-pa-none" push icon="west" @click="getPlanningDB(-1)"/>
				<q-btn class="col q-pa-none" push label="Hoy" icon="today" @click="getPlanningDB()" />
				<q-btn class="col q-pa-none" push icon="east" @click="getPlanningDB(1)"/>
			</q-btn-group>
		</div>
		<div>
			<q-expansion-item 
				id="resumeMeals"
				v-model="showResume"
				dense
				dense-toggle>
				<div v-for="category in categories" :key="category.id">
					<div class="">
						<q-icon class="meal-category-icons q-mr-sm" :name="category.icon.path ? 'img:' + category.icon.path : ''" />
						<span :class="category.optimum_number != category.assigned ? 'text-red-6' : 'text-blue-6'"
							>{{ category.name }}: {{ category.assigned ?? 0 }} / {{ category.optimum_number }}</span
						>
					</div>
				</div>
			</q-expansion-item>
		</div>

		<div class="row justify-evenly">
			<div class="col-12 col-sm-5 col-lg-3 col-xl-auto planning-card q-pt-md q-px-md" v-for="(day, dayOfWeek) in planning" :key="`day-${dayOfWeek}`">
				<div class="row items-baseline justify-between">
					<span class="col text-black text-left text-h4">{{ day.name }}</span>
					<span class="col text-right">{{ day.date }}</span>
				</div>
				<div v-for="(mealHour, mealHourIndex) in day.hours" :key="`div-mealHourId-${mealHour.id}`" class="q-ml-xs">
					<div
						class="text-h6 text-left meal-hours-tittle"
						style="font: size 1.35rem"
						:style="mealHourIndex > 0 ? 'margin-top: -20px;' : 'margin-top: 10px;'"
						@click="seeAllPlanningInConsole('mealHour')"
					>
						<span>{{ mealHour.name }}</span>
						<q-icon class="q-ml-md" name="add_circle_outline">
							<q-tooltip>
								Añadir plato (en este día y hora)
							</q-tooltip>
						</q-icon>
					</div>
					<div class="q-ml-xs q-mt-xs">
						<draggable
							:list="mealHour.meals"
							:item-key="`mealHourId-${mealHour.id}`"
							group="meals"
							class="q-pb-xl"
							@add="addDragging(dayOfWeek, mealHour.id, mealHourIndex)"
							@change="changeDragging"
							:options="{delay:2000}"
						>
							<template #item="{ element }">
								<div class="row items-center handle justify-between q-my-sm">
									<q-icon class="meal-category-icons" :name="element.icon_path ? 'img:' + element.icon_path : ''">
										<q-tooltip>
											{{ element.category_name || 'Sin categoría' }}
										</q-tooltip>
									</q-icon>
									<span class="col-8 q-pl-sm">{{ element.name ?? element.node.name }}</span>
									<q-avatar :style="`cursor:pointer; width:0.5em; height:0.5em; background-color:${element.meal_type_color}; border: 1px solid #d4d4d4;`">
										<q-tooltip>
											{{ element.meal_type_name || 'Sin tipo' }}
										</q-tooltip>
										<q-menu>
											<q-list style="min-width: 100px">
												<q-item clickable @click="updateMealType( element, dayOfWeek, mealHourIndex, mealType )" v-close-popup v-for="mealType in mealTypes" :key="`div-mealTypeId-${mealType.id}`" class="items-center">
													<q-item-section avatar style="min-width: initial">
														<q-avatar :style="`width:0.7em; height:0.7em; background-color:${mealType.color}; border: 1px solid #d4d4d4;`"></q-avatar>
													</q-item-section>
													<q-item-section>{{ mealType.name }}</q-item-section>
												</q-item>
											</q-list>
										</q-menu>
									</q-avatar>
									<q-icon class="meal-remove-icons" name="clear" @click="removeMealPlanningDB(element, mealHourIndex)" @touchend.stop.prevent="removeMealPlanningDB(element, mealHourIndex)">
										<q-tooltip>
											Eliminar
										</q-tooltip>
									</q-icon>
								</div>
							</template>
						</draggable>
					</div>
				</div>
			</div>
		</div>
		<button @click="seeAllPlanningInConsole">See All Planning</button>
		<button @click="deleteAllPlanning">Delete All Planning</button>
	</div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, onBeforeMount } from "vue";
import { api } from "boot/axios";
import draggable from "vuedraggable";

export default {
	name: "Planning",
	components: { draggable },

	setup() {
		let planning = ref({});
		let mealTypes = ref([]);
		let mealHours = ref([]);
		let categories = ref([]);
		let showResume = ref(false);
		let currentItem = {};
		let weekDiff = ref(0);
		const $q = useQuasar();

		onBeforeMount(() => {
			getPlanningDB();
		});

		const getPlanningDB = async ( numWeekToSum = 0 ) => {
			if ( !numWeekToSum && !weekDiff.value && Object.keys(planning.value).length ) {
				return;
			}
			
			$q.loading.show();
			weekDiff.value = numWeekToSum ? weekDiff.value + numWeekToSum : 0;
			await api.post(process.env.API + "planning", {'weekDiff': weekDiff.value}).then((response) => {
				planning.value = response.data.planning;
				mealTypes.value = response.data.mealTypes;
				mealHours.value = response.data.mealHours;
				categories.value = response.data.categories;
				getNumAssignedCategory();
			});
			$q.loading.hide();
		};

		const getNumAssignedCategory = () => {
			for (const day in planning.value) {
				planning.value[day]["hours"].forEach((hour) => {
					hour["meals"].forEach((meal) => {
						addOrSubtractToCategory(meal);
					});
				});
			}
		};

		const addOrSubtractToCategory = (meal, add = true) => {
			let index = categories.value.findIndex((category) => category.id == meal.category_id);

			if (index == -1) {
				return;
			}

			categories.value[index].assigned =
				categories.value[index].assigned != null ? (add ? ++categories.value[index].assigned : --categories.value[index].assigned) : 1;
		};

		const changeDragging = (e) => {
			if (isEventAdded(e)) {
				currentItem = isMovedFromPlanning(e) ? { ...e.added.element } : { ...e.added.element.node };
				currentItem.order = e.added.newIndex + 1;
			} else if (isEventMoved(e)) {
				currentItem = { ...e.moved.element };
				currentItem.order = e.moved.newIndex + 1;
				updateOrderDB();
			} else {
				removeMealPlanningDB(e.removed.element);
			}
		};

		const addDragging = (dayOfWeek, hourId, hourIndex) => {
			console.log("addDragging dragging Planning...", dayOfWeek, hourId, hourIndex);
			currentItem.day_of_week = dayOfWeek;
			currentItem.meal_hour_id = hourId;
			currentItem.date = planning.value[dayOfWeek].date;

			saveMealDB(hourIndex);
		};

		const saveMealDB = async (hourIndex) => {
			$q.loading.show();
			await api
				.post(process.env.API + "planningStore", currentItem)
				.then((response) => {
					planning.value[currentItem.day_of_week]["hours"][hourIndex]["meals"] = response.data;
					addOrSubtractToCategory(currentItem);
				})
				.catch((error) => {
					console.log(error);
				});
			$q.loading.hide();
		};

		const getIndexHourItem = (item) => {
			let indexHour;
			planning.value[item.day_of_week]["hours"].forEach((hour, index) => {
				if (hour.id == item.meal_hour_id) {
					indexHour = index;
				}
			});

			return indexHour;
		};

		const updateOrderDB = async () => {
			$q.loading.show();

			let indexHour = getIndexHourItem(currentItem);

			await api
				.post(process.env.API + "update-order-planning", currentItem)
				.then((response) => {
					planning.value[currentItem.day_of_week]["hours"][indexHour]["meals"] = response.data;
				})
				.catch((error) => {
					console.log(error);
				});
			$q.loading.hide();
		};

		const removeMealPlanningDB = async (item, indexHour = null) => {
			console.log("Click remove");
			$q.loading.show();

			if (indexHour === null) {
				indexHour = getIndexHourItem(item);
			}

			await api
				.delete(process.env.API + "planning/" + item.id)
				.then((response) => {
					planning.value[item.day_of_week]["hours"][indexHour]["meals"] = response.data;
					addOrSubtractToCategory(item, false);
				})
				.catch((error) => {
					console.error(error);
				});

			$q.loading.hide();
		};

		const previousWeek = () => {
			$q.loading.show();





			 api
				.post(process.env.API + "getplanning", currentItem)
				.then((response) => {
					planning.value[currentItem.day_of_week]["hours"][hourIndex]["meals"] = response.data;
					addOrSubtractToCategory(currentItem);
				})
				.catch((error) => {
					console.log(error);
				});
			$q.loading.hide();
		};

		const isMovedFromPlanning = (e) => {
			return !e.added.element.hasOwnProperty("key");
		};

		const isEventAdded = (e) => {
			return e.hasOwnProperty("added");
		};
		const isEventMoved = (e) => {
			return e.hasOwnProperty("moved");
		};

		const seeAllPlanningInConsole = (element = '') => {
			alert("click en " + element);
			console.log("All Planning", planning.value);
			// console.log("1-0", planning.value[2]["hours"][1]["meals"]);
		};

		const deleteAllPlanning = async () => {
			await api
				.delete(process.env.API + "delete-all-planning")
				.then((response) => {
					planning.value = response.data.planning;
					categories.value.forEach((category) => {
						category.assigned = 0;
					});
				})
				.catch((error) => {
					console.error(error);
				});
		};

		const updateMealType = async ( currentItem, dayOfWeek, hourIndex, mealType ) => {
			currentItem.meal_type_id    = mealType.id;
			currentItem.meal_type_color = mealType.color;
			let index = planning.value[dayOfWeek]["hours"][hourIndex]["meals"].indexOf( currentItem );

			await api
				.post(process.env.API + "updateMealType", currentItem)
				.then((response) => {
					planning.value[dayOfWeek]["hours"][hourIndex]["meals"][ index ] = currentItem;
				})
				.catch((error) => {
					console.error(error);
				}); 
		};

		const saluda = () => {
			alert("Hola");
		}

		return {
			planning,
			mealTypes,
			mealHours,
			categories,
			showResume,
			seeAllPlanningInConsole,
			deleteAllPlanning,
			addDragging,
			changeDragging,
			removeMealPlanningDB,
			weekDiff,
			getPlanningDB,
			updateMealType,
			saluda
		};
	},
};
</script>

<style lang="scss" scoped>
.my-card {
	// width: 100%;
	// margin: 0.5rem 0;
	// gap: 10px;
}

.subtitle {
	font-size: 1rem;
	font-weight: 600;
}

.btnCollapseOpen {
	width: 100%;
	white-space: pre-line;
	line-height: 1.2rem;
	min-height: 1rem;
}

.bloque {
	height: 200px;
	background-color: red;
}

.handle:hover {
	cursor: move;
}
</style>
