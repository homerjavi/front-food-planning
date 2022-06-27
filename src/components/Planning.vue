<template>
	<div q-pa-md>
		<h3 @click="saluda" class="text-center q-mt-none q-mb-md">Planning</h3>
		<h3 @click="calcNumAssignedMealsForType" class="text-center q-mt-none q-mb-md">Test</h3>
		<div class="row justify-between q-mt-sm">
			<q-toggle class="col" v-model="showResume" label="Ver resumen" @click="calcNumAssignedMealsForType"/>
			<q-btn-group push class="col" style="max-width: 400px;">
				<q-btn class="col q-pa-none" push icon="west" @click="getPlanningDB(-1)"/>
				<q-btn class="col q-pa-none" push label="Hoy" icon="today" @click="getPlanningDB()" />
				<q-btn class="col q-pa-none" push icon="east" @click="getPlanningDB(1)"/>
			</q-btn-group>
		</div>
		<div v-if="showResume" class="q-my-sm">
			<q-expansion-item 
				id="resumeMeals"
				v-model="showResume"
				dense
				dense-toggle
			>
				<div class="row justify-evenly">
					<div v-for="mealType in mealTypes.filter( mealtype => !mealtype.general )" :key="mealType.id" class="col-12 col-sm-5 planning-card">
						<q-card>
							<q-card-section class="row">
								<q-avatar :style="`width:0.7em; height:0.7em; background-color:${mealType.color}; border: 1px solid #d4d4d4;`"></q-avatar>
								<div class="text-h6 q-ml-sm">{{ mealType.name }}</div>
							</q-card-section>

							<q-card-section>
								<div v-for="category in categories" :key="category.id">
									<div class="">
										<q-icon class="meal-category-icons q-mr-sm" :name="category.icon.path ? 'img:' + category.icon.path : ''" />
										<span :class="mealTypesAssigned[ mealType.id ][ category.id ] < category.optimum_number ? 'text-red-6' : 'text-blue-6'">
											{{ category.name }}: {{ mealTypesAssigned[ mealType.id ][ category.id ] ?? 0 }} / {{ category.optimum_number }}
										</span>
									</div>
								</div>
							</q-card-section>

							<q-separator dark />
						</q-card>
					</div>
				</div>
			</q-expansion-item>
		</div>
		

		<div class="row justify-evenly q-mt-md">
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
							handle=".handle"
							:item-key="`mealHourId-${mealHour.id}`"
							group="meals"
							class="q-pb-xl"
							@add="addDragging(dayOfWeek, mealHour.id, mealHourIndex)"
							@change="changeDragging"
							:options="{delay:2000}"
						>
							<template #item="{ element }">
								<div class="row items-center justify-between q-my-sm">
									<q-icon class="meal-category-icons handle" :name="element.icon_path ? 'img:' + element.icon_path : ''">
										<q-tooltip>
											{{ element.category_name || 'Sin categoría' }}
										</q-tooltip>
									</q-icon>
									<span class="col-8 q-pl-sm">{{ element.name ?? element.node.name }}</span>
									<q-avatar  :style="`cursor:pointer; width:0.5em; height:0.5em; background-color:${element.meal_type_color}; border: 1px solid #d4d4d4;`">
										<q-tooltip>
											{{ element.meal_type_name || 'Sin tipo' }}
										</q-tooltip>
										<q-menu v-show="viewMenuMealTypes">
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
									<q-icon class="meal-remove-icons" name="clear" @click="removeMealPlanningDB(element, mealHourIndex)">
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
		let viewMenuMealTypes = ref(false)
		let weekDiff = ref(0);
		const $q = useQuasar();
		let mealTypesAssigned = ref({});


		onBeforeMount(() => {
			getPlanningDB();
		});

		const getPlanningDB = async ( numWeekToSum = 0 ) => {
			if ( !numWeekToSum && !weekDiff.value && Object.keys(planning.value).length ) {
				return;
			}
			
			$q.loading.show();
			weekDiff.value = numWeekToSum ? weekDiff.value + numWeekToSum : 0;
			await api.post(process.env.API + "planning", {'weekDiff': weekDiff.value})
				.then((response) => {
					planning.value = response.data.planning;
					mealTypes.value = response.data.mealTypes;
					mealHours.value = response.data.mealHours;
					categories.value = response.data.categories;
					// getNumAssignedCategory();
				}).catch( () => {
					
				} ).finally( () => {
					$q.loading.hide();
				} );
		};

		/* const getNumAssignedCategory = () => {
			for (const day in planning.value) {
				planning.value[day]["hours"].forEach((hour) => {
					hour["meals"].forEach((meal) => {
						addOrSubtractToCategory(meal);
					});
				});
			}
		}; */

		const addOrSubtractToCategory = (meal, add = true) => {
			let index = categories.value.findIndex((category) => category.id == meal.category_id);

			if (index == -1) {
				return;
			}

			categories.value[index].assigned = categories.value[index].assigned != null 
				? (add ? ++categories.value[index].assigned : --categories.value[index].assigned) 
				: 1;
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
				})
				.finally( () => {
					calcNumAssignedMealsForType();
				} ); ;
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
				})
				.finally( () => {
					calcNumAssignedMealsForType();
				} ); ;

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
				})
				.finally( () => {
					calcNumAssignedMealsForType();
				} ); ;
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
				})
				.finally( () => {
					calcNumAssignedMealsForType();
				} ); ;
		};

		const updateMealType = async ( currentItem, dayOfWeek, hourIndex, mealType ) => {
			console.log('Entra en updateMealType');
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
				})
				.finally( () => {
					calcNumAssignedMealsForType();
				} ); 
		};

		const saluda = () => {
			let meals = [];
			console.log('----');
			for (const day of Object.values(planning.value)) {
				console.log(day);	
			}

			console.log('----');

			Object.values(planning.value).forEach( day => {
				day.hours.forEach( hour => {
					hour.meals.forEach( meal => {
						meals.push( meal );
					} )
				} );
			} )

			console.log('----');
			console.log(meals);
		};

		const calcNumAssignedMealsForType = () => {
			if ( !showResume.value ) {
				return;
			}
			const mealsInPlanning = getFlatMealsAssignedInPlanning();
			
			let categoriesObject = {};
			categories.value.forEach( category => {
				categoriesObject[ category.id ] = 0;
			} );

			mealTypes.value.forEach( mealType => {
				if (mealType.general) return;
				mealTypesAssigned.value[mealType.id] = {...categoriesObject};
			} );


			mealsInPlanning.forEach( mealInPlanning => {
				if ( mealTypesAssigned.value.hasOwnProperty( mealInPlanning.meal_type_id ) ) {
					mealTypesAssigned.value[ mealInPlanning.meal_type_id ][ mealInPlanning.category_id ]++;
				} else{
					Object.keys( mealTypesAssigned.value ).forEach( key => {
						mealTypesAssigned.value[ key ][ mealInPlanning.category_id ] = mealTypesAssigned.value[ key ][ mealInPlanning.category_id ] + 1;
					} );
				}
			});

/* 			mealTypes.value.forEach( mealType => {
				if (mealType.general) return;
				mealTypesAssigned[mealType.id] = [];
				categories.value.forEach( category => {
					let count = mealsInPlanning.filter( meal => { 
						return meal.category_id == category.id 
							&& meal.meal_type_id == mealType.id 
							// ||mealTypesGenerals.includes(meal.meal_type_id)
					} ).lenght ?? 0;
					mealTypesAssigned[ mealType.id ][ category.id ] = count;
				} );	
			} );
			console.log( 'mealTypesAssigned', mealTypesAssigned ); */
		};

		const getFlatMealsAssignedInPlanning = () => {
			let meals = [];
			Object.values(planning.value).forEach( day => {
				day.hours.forEach( hour => {
					hour.meals.forEach( meal => {
						meals.push( meal );
					} )
				} );
			} )

			return meals;
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
			weekDiff,
			getPlanningDB,
			updateMealType,
			saluda,
			viewMenuMealTypes,
			calcNumAssignedMealsForType,
			mealTypesAssigned,
		};
	},
};
</script>

<style lang="scss" scoped>
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
