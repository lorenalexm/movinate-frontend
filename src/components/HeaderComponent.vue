<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useConnectionStore } from "../stores/connection"

let router = useRouter()
let connectionStore = useConnectionStore()
let authStore = useAuthStore()

/**
 * Clears the authToken from stored locations, and redirects to the home view.
 */
function logoutClicked() {
	connectionStore.disconnectSocket()
	localStorage.clear()
	authStore.authToken = null
	if (router.currentRoute != "/") {
		router.push("/")
	}
}
</script>

<template>
	<div class="ms-card ms-fill">
		<div class="container">
			<div class="row align-items-center">
				<div class="col">
					<h1>Movinate</h1>
				</div>
				<div class="col d-flex justify-content-end">
					<button v-if="authStore.authToken" @click="logoutClicked" class="ms-btn ms-action2">Logout</button>
				</div>
			</div>
		</div>
	</div>
</template>
