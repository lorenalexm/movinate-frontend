<script setup>
import { RouterView } from "vue-router";
import HeaderComponent from "./components/HeaderComponent.vue"
import ToastComponent from "./components/ToastComponent.vue"
</script>

<template>
	<ToastComponent />
	<main class="container ms-pt-4">
		<HeaderComponent />
		<RouterView/>
	</main>
</template>
