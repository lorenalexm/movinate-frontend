<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { getLoginUrl, loginCheck } from "../libs/plex"
import { useConnectionStore } from "../stores/connection"
import { useToastStore } from "../stores/toast"
import { useAuthStore } from "../stores/auth"

let router = useRouter()
let processing = ref(false);
let connectionStore = useConnectionStore()
let authStore = useAuthStore()
let toastStore = useToastStore()

/**
 * Takes the user through the Plex.tv login flow.
 * Connects to the socket server if login successful or authToken already stored.
 * Redirects to the Rooms view if authToken already stored.
 */
async function onClicked() {
	processing.value = true;

	if (authStore.authToken) {
		connectionStore.connectSocket()
		await router.push("/servers")
		return
	}

	let data = await getLoginUrl()
	if (!data) {
		return
	}

	let popup = window.open(data.uri, "_blank")
	if (popup == null || typeof popup == "undefined" || popup.closed) {
		toastStore.warning({
			title: "Popup blocked!",
			message: "Looks like your browser blocked our popup. We need this to sign in to Plex.tv. Please unblock and try again!",
			timeout: 5000
		})
		processing.value = false
		return
	}

	popup.focus()
	loginCheck(data.id, data.code)
		.then(async (authToken) => {
			authStore.authToken = authToken
			connectionStore.connectSocket()
			await new Promise((resolve) => {
				setTimeout(resolve, 100)
			})
			connectionStore.createRoom()
			router.push("/servers")
		})
		.catch((error) => {
			console.error(error)
		}).finally(() => {
			processing.value = false
		})
}
</script>

<template>
	<div class="ms-card ms-fill">
		<div class="ms-card-title">
			<h2>Create a room</h2>
		</div>
		<div class="ms-card-content">
			<p>Got Plex? Great! Use that to login here and get started with your movie night!</p>
		</div>
		<div class="ms-card-btn">
			<button class="ms-btn ms-primary ms-medium" @click="onClicked" :disabled="processing">
				<div class="ms-loading ms-primary ms-small" v-if="processing"></div>
				Login with Plex
			</button>
		</div>
	</div>
</template>
