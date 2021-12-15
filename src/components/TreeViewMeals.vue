<template>
	<div id="TreeViewMeals">
		<h4 class="text-center q-ma-none">Platos</h4>
		<div class="q-py-md"></div>
		<div class="row no-wrap items-end">
			<div class="col-8">
				<!-- <q-input ref="filterRef" v-model="filter" label="Filter">
					<template v-slot:append>
						<q-icon
							v-if="filter !== ''"
							name="clear"
							class="cursor-pointer"
							@click="resetFilter"
						/>
					</template>
				</q-input> -->
			</div>
			<div class="col-4 q-ml-sm">
				<!-- <q-btn
					class="btnCollapseOpen"
					push
					dense
					color="primary"
					:label="collapseOpen"
					@click="toogleTree"
				/> -->
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
							<template
								v-if="
									typeof prop.node.category_id === 'undefined'
								"
							>
							<!-- <div class="row items-center justify-between"> -->
								<span
									class="text-weight-bold text-h6"
									color="primary"
									>{{ prop.node.name }}</span
								>
								<q-icon class="col-2" :name="prop.node.icon.path ? 'img:' + prop.node.icon.path : ''" />
							<!-- </div> -->
							</template>
							<template v-else>
								<draggable
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
											
											<!-- <q-chip
												class="handle"
												color="primary"
												text-color="white"
											>
												{{ element.node.name }}
											</q-chip> -->
										</div>
									</template>
								</draggable>
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
	setup() {
		const emitter = inject("emitter");
		const expandedKeys = ref([]);
		const isExpanded = ref(true);
		const dragging = ref(false);
		const categories = ref([]);
		const collapseOpen = ref("Abrir todos");
		const filter = ref("");
		const currentlyDragging = false;

		onBeforeMount(() => {
			getCategoriesDB();
			//this.$refs.tree.collapseAll();
		});

		const getCategoriesDB = async () => {
			await api.get(process.env.API + "categories").then((response) => {
				categories.value = response.data.categories;
			});
		};

		/* 	const toogleTree = () => {
			if (this.$refs.tree.getExpandedNodes().length > 0) {
				this.$refs.tree.collapseAll();
				this.collapseOpen = `Abrir\ntodos`;
			} else {
				this.$refs.tree.expandAll();
				this.collapseOpen = "Cerrar\ntodos";
			}
		};

		const resetFilter = () => {
			this.filter = "";
			this.$refs.filterRef.focus();
		}; */

		/* const startDragging = (item) => {
			console.log("Start dragging Tree", item);
			//console.log( 'this.$parent.leftDrawerOpen', this.leftDrawerOpen_ );
			//this.leftDrawerOpen_ = false;
			//console.log( 'this.$parent.leftDrawerOpen', this.leftDrawerOpen_ );

			//this.$emit('updateParent', this.$parent.leftDrawerOpen)
			//this.$emit('update:currentItem', item);

			this.$parent.currentItem = item;
			console.log("Fin de Start dragging Tree", this.$parent.currentItem);
			this.currentlyDragging = true;

			emitter.emit( 'updateCurrentItem', item );
		}; */

		/* const endDragging = () => {
			console.log("End dragging Tree");
			this.currentlyDragging = false;
		}; */

		/* const addDragging = () => {
			console.log("Add dragging Tree");
		}; */

		/* const mousedown = () => {
			console.log("mousedown");
		}; */

		/* const mouseup = () => {
			console.log("mouseup");
		}; */

		return {
			expandedKeys,
			isExpanded,
			dragging,
			filter,
			// resetFilter,
			collapseOpen,
			// toogleTree,
			categories,
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
