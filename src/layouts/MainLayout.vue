<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar>
				<q-btn
					flat
					dense
					round
					icon="menu"
					aria-label="Menu"
					@click="toggleLeftDrawer"
				/>

				<q-toolbar-title>Comidas</q-toolbar-title>
			</q-toolbar>
		</q-header>

		<q-drawer
			v-model="leftDrawerOpen"
			
			bordered
			class="bg-grey-1"
		>
			<q-list>
				<q-item-label header class="text-grey-8"> Menú </q-item-label>

				<EssentialLink
					v-for="link in linksList"
					:key="link.title"
					v-bind="link"
				/>
			</q-list>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
	{
		title: "Planning",
		caption: "",
		icon: "edit_calendar",
		link: "",
	},
	{
		title: "Platos",
		caption: "",
		icon: "restaurant",
		link: "meals",
	},
	{
		title: "Categorías",
		caption: "",
		icon: "category",
		link: "categories",
	},
	{
		title: "Tipos",
		caption: "",
		icon: "format_list_bulleted",
		link: "meal-types",
	},
	{
		title: "Horarios",
		caption: "",
		icon: "watch_later",
		link: "timetables",
	},
	{
		title: "Ingredientes",
		caption: "",
		icon: "info",
		link: "",
	},
	{
		title: "Recetas",
		caption: "",
		icon: "menu_book",
		link: "",
	},
	{
		title: "Test",
		caption: "",
		icon: "menu_book",
		link: "test",
	},
];

import { ref, inject, onMounted, watch, onBeforeMount } from "vue";

export default {
	name: "MainLayout",

	components: {
		EssentialLink,
	},

	setup() {
		const leftDrawerOpen         = ref(false);
		const leftDrawerTreeViewOpen = ref(false);
		const emitter                = inject("emitter");

		watch(leftDrawerOpen, async (newQuestion, oldQuestion) => {
  console.log( newQuestion, oldQuestion );
})

		onBeforeMount(() => {
			leftDrawerOpen.value = false;
		});
		onMounted(() => {
			emitter.on(
				"updateLeftDrawerTreeViewOpen",
				(onLeftDrawerTreeViewOpen) => {
					leftDrawerTreeViewOpen.value = onLeftDrawerTreeViewOpen;
					leftDrawerOpen.value = false;
				}
			);
		});

		const toggleLeftDrawer = () => {
			leftDrawerTreeViewOpen.value = false;
			emitter.emit("closeTreeViewMealsDrawer", "OK");
			console.log( "Antes", leftDrawerOpen.value );
			setTimeout(() => {
				leftDrawerOpen.value = !leftDrawerOpen.value;	
				console.log( "Ahora", leftDrawerOpen.value );
			}, 0);
		};

		return {
			linksList,
			leftDrawerOpen,
			toggleLeftDrawer,
		};
	},
};
</script>
