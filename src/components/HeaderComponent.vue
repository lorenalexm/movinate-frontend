<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"

let router = useRouter()
let store = useAuthStore()

/**
 * Clears the authToken from stored locations, and redirects to the home view.
 */
function logoutClicked() {
	localStorage.clear()
	store.authToken = null
	if (router.currentRoute != "/") {
		router.push("/")
	}
}
</script>

<template>
	<div class="ms-menu">
		<div class="ms-menu-logo">
			<p>Movinate</p>
		</div>
		<nav class="ms-menu-link">
			<button v-if="store.authToken" @click="logoutClicked" class="ms-btn ms-action2">Logout</button>
		</nav>
	</div>
</template>
