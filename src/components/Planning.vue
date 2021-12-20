<template>
	<div>
		<h3 class="text-center q-mt-none q-mb-md">Planning</h3>
		<!-- <button @click="showResume = !showResume">Ver resumen</button> -->
		<div class="q-pa-md">
			<q-toggle v-model="showResume" label="Ver resumen" />
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
				<div class="row text-black text-left text-h4">
					{{ day.name }}
				</div>
				<div v-for="(mealHour, mealHourIndex) in day.hours" :key="`div-mealHourId-${mealHour.id}`" class="q-ml-xs">
					<div
						class="text-h6 text-left meal-hours-tittle"
						style="font: size 1.35rem"
						:style="mealHourIndex > 0 ? 'margin-top: -20px;' : 'margin-top: 10px;'"
						@click="seeAllPlanningInConsole('mealHour')"
					>
						{{ mealHour.name }}
					</div>
					<div class="q-ml-xs q-mt-xs">
						<draggable
							:list="mealHour.meals"
							:item-key="`mealHourId-${mealHour.id}`"
							group="meals"
							class="q-pb-xl"
							@add="addDragging(dayOfWeek, mealHour.id, mealHourIndex)"
							@change="changeDragging"
						>
							<template #item="{ element }">
								<div class="row items-center handle justify-between q-my-sm">
									<q-icon class="meal-category-icons" :name="element.icon_path ? 'img:' + element.icon_path : ''" />
									<span class="col-8 q-pl-sm">{{ element.name ?? element.node.name }}</span>
									<q-icon class="meal-remove-icons" name="clear" @mousedown.stop.prevent="removeMealPlanningDB(element)" @touchstart.stop.prevent="removeMealPlanningDB(element)"/>
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
		let mealTypes = ref({});
		let mealHours = ref({});
		let categories = ref([]);
		let showResume = ref(false);
		let currentItem = {};
		const $q = useQuasar();

		onBeforeMount(() => {
			getPlanningDB();
		});

		const getPlanningDB = async () => {
			await api.get(process.env.API + "planning").then((response) => {
				planning.value = response.data.planning;
				mealTypes.value = response.data.mealTypes;
				mealHours.value = response.data.mealHours;
				categories.value = response.data.categories;
				getNumAssignedCategory();
			});
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

			saveMealDB(hourIndex);
		};

		const saveMealDB = async (hourIndex) => {
			$q.loading.show();
			await api
				.post(process.env.API + "planning", currentItem)
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
