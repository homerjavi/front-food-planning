<template>
	<div q-pa-md>
		<q-dialog v-model="visibleTreeViewMeals">
			<q-card>
				<q-card-section class="row items-center q-pb-none">
					<div class="text-h6">Close icon</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
				</q-card-section>

				<q-card-section>
					<tree-view-meals :clicable="true" @addMealToDayAndHour="onAddMealInDayAndHour"></tree-view-meals>
				</q-card-section>
			</q-card>
		</q-dialog>
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
					<span class="col text-right">{{ $filters.formatDate(day.date) }}</span>
				</div>
				<div v-for="(mealHour, mealHourIndex) in day.hours" :key="`div-mealHourId-${mealHour.id}`" class="q-ml-xs">
					<div
						class="text-h6 text-left meal-hours-tittle"
						style="font: size 1.35rem"
						:style="mealHourIndex > 0 ? 'margin-top: -20px;' : 'margin-top: 10px;'"
						@click="addMealInDayAndHour( dayOfWeek, mealHour.id, mealHourIndex )"
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
	</div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, onBeforeMount, onMounted } from "vue";
import { api } from "boot/axios";
import draggable from "vuedraggable";
import TreeViewMeals from "components/TreeViewMeals";
import { useStore } from 'vuex'

export default {
	name: "Planning",
	components: { draggable, TreeViewMeals },

	setup() {
		const store = useStore();
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
		let visibleTreeViewMeals = ref(false);
		let lastMealTypeUsed = null;
		let currentDay = ref(null)
		let currentHour = ref(null)
		let currentHourIndex = ref(null)


		onBeforeMount(() => {
			getPlanningDB();
		});

		onMounted(() => {
			console.log( 'STORE AUTH', store.state.auth.username );
		});

		const getPlanningDB = async ( numWeekToSum = 0 ) => {
			if ( !numWeekToSum && !weekDiff.value && Object.keys(planning.value).length ) {
				return;
			}
			
			$q.loading.show();
			weekDiff.value = numWeekToSum ? weekDiff.value + numWeekToSum : 0;
			await api.get(process.env.API + `planning?weekDiff=${weekDiff.value}`, { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
				.then((response) => {
					planning.value   = response.data.planning;
					mealTypes.value  = response.data.mealTypes;
					mealHours.value  = response.data.mealHours;
					categories.value = response.data.categories;
				}).catch( () => {
					
				} ).finally( () => {
					$q.loading.hide();
				} );
		};

		/* const addOrSubtractToCategory = (meal, add = true) => {
			let index = categories.value.findIndex((category) => category.id == meal.category_id);

			if (index == -1) {
				return;
			}

			categories.value[index].assigned = categories.value[index].assigned != null 
				? (add ? ++categories.value[index].assigned : --categories.value[index].assigned) 
				: 1;
		}; */

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
			currentItem.day_of_week = dayOfWeek;
			currentItem.meal_hour_id = hourId;
			currentItem.date = planning.value[dayOfWeek].date;
			currentItem.meal_type_id = currentItem.meal_type_id ?? lastMealTypeUsed;

			saveMealDB(hourIndex);
		};

		const saveMealDB = async (hourIndex) => {
			$q.loading.show();
			await api
				.post(process.env.API + "planning", currentItem, { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
				.then((response) => {
					planning.value[currentItem.day_of_week]["hours"][hourIndex]["meals"] = response.data;
					// addOrSubtractToCategory(currentItem);
				})
				.catch((error) => {
					console.log(error);
				})
				.finally( () => {
					calcNumAssignedMealsForType();
					$q.loading.hide();
				} ); ;
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
				.post(process.env.API + "updateOrderPlanning", currentItem, { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
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
				.delete(process.env.API + "planning/" + item.id, { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
				.then((response) => {
					planning.value[item.day_of_week]["hours"][indexHour]["meals"] = response.data;
					// addOrSubtractToCategory(item, false);
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
				.post(process.env.API + "getplanning", currentItem, { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
				.then((response) => {
					planning.value[currentItem.day_of_week]["hours"][hourIndex]["meals"] = response.data;
					// addOrSubtractToCategory(currentItem);
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
			console.log("All Planning", planning.value);
		};

		const updateMealType = async ( currentItem, dayOfWeek, hourIndex, mealType ) => {
			console.log('Entra en updateMealType');
			lastMealTypeUsed            = mealType.id;
			currentItem.meal_type_id    = mealType.id;
			currentItem.meal_type_color = mealType.color;
			let index = planning.value[dayOfWeek]["hours"][hourIndex]["meals"].indexOf( currentItem );

			await api
				.post(process.env.API + "updateMealType", currentItem, { headers: {"Authorization" : `Bearer ${store.state.auth.token}`} })
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
			console.log( store.state.auth );
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

		const addMealInDayAndHour = ( dayOfWeek, hourId, hourIndex ) => {
			console.log( {dayOfWeek, hourId, hourIndex} );
			visibleTreeViewMeals.value = true;

			currentItem.day_of_week = dayOfWeek;
			currentItem.meal_hour_id = hourId;
			currentItem.date = planning.value[dayOfWeek].date;
			currentItem.hour_index = hourIndex;
			currentItem.order = planning.value[dayOfWeek]["hours"][hourIndex]["meals"].length + 1;
			currentItem.meal_type_id = lastMealTypeUsed;
		};

		const onAddMealInDayAndHour = ( selectedMealId ) => {
			currentItem.meal_id = selectedMealId;
			saveMealDB( currentItem.hour_index );
			visibleTreeViewMeals.value = false;
		};

		return {
			planning,
			mealTypes,
			mealHours,
			categories,
			showResume,
			seeAllPlanningInConsole,
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
			addMealInDayAndHour,
			onAddMealInDayAndHour,
			TreeViewMeals,
			visibleTreeViewMeals
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
