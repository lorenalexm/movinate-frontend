<script setup>
import { RouterView } from "vue-router";
import HeaderComponent from "./components/HeaderComponent.vue"
</script>

<template>
	<main class="container ms-pt-4">
		<HeaderComponent />
		<RouterView/>
	</main>
</template>
