<template>
	<div id="TreeViewMeals">
		{{ isClicable }}
		<h4 class="text-center q-ma-none">Platos</h4>
		<div class="q-py-md"></div>
		<div class="row no-wrap items-end">
			<div class="col-8">
				<q-input ref="filterRef" v-model="filter" label="Filter" @keyup="openOrCloseTree">
					<template v-slot:append>
						<q-icon
							v-if="filter !== ''"
							name="clear"
							class="cursor-pointer"
							@click="resetFilter"
						/>
					</template>
				</q-input>
			</div>
			<div class="col-4 q-ml-sm">
				<q-btn
					class="btnCollapseOpen"
					push
					dense
					color="primary"
					:label="collapseOpen"
					@click="toogleTree"
				/>
			</div>
		</div>

		<div class="row q-mt-md">
			<div class="col-12">
				<q-tree
					ref="tree"
					:nodes="categories"
					node-key="name"
					label-key="name"
					children-key="meals"
					:v-model="expandedKeys"
					:filter="filter"
					default-expand
				>
					<template v-slot:default-header="prop">
						<div class="row items-center justify-between full-width">
							<template v-if="typeof prop.node.category_id === 'undefined'">
								<span class="text-weight-medium text-h6" color="primary">{{ prop.node.name }}</span>
								<q-icon class="col-2 q-py-sm" :name="prop.node.icon.path ? 'img:' + prop.node.icon.path : ''" />
							</template>
							<template v-else>
								<draggable
									v-if="!isClicable"
									:list="[prop]"
									:item-key="prop.node.name"
									:group="{
										name: 'meals',
										pull: 'clone',
										put: false,
									}"
								>
									<template #item="{ element }">
										<div class="
													handle
													text-black text-left
													bg-transparent
												"
											>
												{{ element.node.name }}
										</div>
									</template>
								</draggable>
								<div 
									v-if="isClicable"
									@dblclick="addMealToDayAndHour(prop.node.meal_id)"
									class="handle text-black text-left bg-transparent"
								>
									{{ prop.node.name }}
								</div>
							</template>
						</div>
					</template>
				</q-tree>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, inject, onBeforeMount } from "vue";
import { api } from "boot/axios";
import draggable from "vuedraggable";

export default {
	name: "TreeViewMeals",
	components: {
		draggable,
	},
	props: [ 'clicable' ],
	setup( props, context ) {
		const emitter = inject("emitter");
		const expandedKeys = ref([]);
		const isExpanded = ref(true);
		const dragging = ref(false);
		const categories = ref([]);
		const collapseOpen = ref("Abrir todos");
		const filter = ref("");
		const filterRef = ref(null);
		const currentlyDragging = false;
		const tree = ref(null);
		const isClicable = ref(props.clicable);

		onBeforeMount(() => {
			getCategoriesDB();
		});

		const getCategoriesDB = async () => {
			await api.get(process.env.API + "categories").then((response) => {
				categories.value = response.data.categories;
			});
		};

		const toogleTree = () => {
			if (tree.value.getExpandedNodes().length > 0) {
				setCollapseAllTree();
			} else {
				setExpandedAllTree();
			}
		};

		const openOrCloseTree = () => {
			if ( filter.value == '' ) {
				setCollapseAllTree();
			} else {
				setExpandedAllTree();
			}
		};

		const resetFilter = () => {
			setCollapseAllTree();
			filter.value = "";
			filterRef.value.focus();
		};

		const setCollapseAllTree = () => {
			tree.value.collapseAll();
			collapseOpen.value = `Abrir\ntodos`;
		}

		const setExpandedAllTree = () => {
			tree.value.expandAll();
			collapseOpen.value = "Cerrar\ntodos";
		}

		const addMealToDayAndHour = ( selectedMeal ) => {
			console.log( selectedMeal );
			context.emit( 'addMealToDayAndHour', selectedMeal );
		};

		return {
			expandedKeys,
			isExpanded,
			dragging,
			filter,
			filterRef,
			resetFilter,
			collapseOpen,
			toogleTree,
			categories,
			tree,
			openOrCloseTree,
			isClicable,
			addMealToDayAndHour
			// startDragging,
			// endDragging,
		};
	},
};
</script>

<style lang="scss" scoped>

.my-card {
	width: 100%;
	max-width: 250px;
	margin: 0.5rem 0;
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

.handle:hover {
	cursor: move;
}
</style>
