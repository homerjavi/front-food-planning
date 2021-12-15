<template>
	<q-page class="q-pa-md">
		<div class="q-py-lg">
			<q-drawer
				v-model="leftDrawerTreeViewOpen"
				id="tree"
				ref="tree"
				show-if-above
				bordered
				class="bg-grey-1 q-pa-md"
			>
				<tree-view-meals 
					@touchstart="touchstart"
					@mousedown="mousedown"
					@mouseup="mouseup"
				/>
			</q-drawer>
			<div class="row">
				<div class="col-12 q-px-sm">
					<planning />
				</div>
			</div>
		</div>
		<q-page-sticky position="bottom-right" :offset="[18, 18]">
			<q-btn fab icon="add" color="primary" @click="toggleLeftDrawerTreeView" />
		</q-page-sticky>
	</q-page>
</template>

<script>
import { ref, inject, onMounted } from "vue";
import TreeViewMeals from "components/TreeViewMeals";
import Planning from "components/Planning";
import { useQuasar } from 'quasar'

export default {
	name: "PlanningPage",
	components: {
		TreeViewMeals,
		Planning,
	},

	setup() {
		let leftDrawerTreeViewOpen = ref( false );
		let lastEventMouse         = "";
		let emitter                = inject("emitter");
		const $q = useQuasar();

		onMounted( () => {
			emitter.on("closeTreeViewMealsDrawer", () => {
				leftDrawerTreeViewOpen.value = false;
			});
		} );

		const toggleLeftDrawerTreeView = () => {
			leftDrawerTreeViewOpen.value = !leftDrawerTreeViewOpen.value;
			emitter.emit( "updateLeftDrawerTreeViewOpen", leftDrawerTreeViewOpen.value);
		};

		const touchstart = () => {
			console.log("Touch start");
			lastEventMouse = "mousedown";
			checkLastMouseEvent();
		};

		const mousedown = () => {
			console.log("Mouse down");
			lastEventMouse = "mousedown";
			checkLastMouseEvent();
		};

		const mouseup = () => {
			console.log("Mouse up");
			lastEventMouse = "mouseup";
		};

		const checkLastMouseEvent = () => {
			console.log("checklastMouse");
			console.log("Is mobile?", $q.platform.is.mobile);
			console.log("Screen", $q.screen);
			console.log("Is small?", $q.screen.xs, $q.screen.sm);
			// if ($q.platform.is.mobile) {
			if ( $q.screen.xs || $q.screen.sm ) {
				window.setTimeout(() => {
				console.log("checklastMouse");
				if (lastEventMouse == "mousedown") {
					toggleLeftDrawerTreeView();
				}
			}, 1000);
			}
		};

		return { leftDrawerTreeViewOpen, toggleLeftDrawerTreeView, touchstart, mousedown, mouseup };
	},
};
</script>
