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
		await new Promise((resolve) => {
			setTimeout(resolve, 100)
		})
		connectionStore.createRoom()
		await router.push("/servers")
		return
	}

	let data = await getLoginUrl()
	if (!data) {
		toastStore.warning({
			title: "Plex.tv Issue!",
			message: "It appears as though we can't talk to Plex.tv right now. It isn't us, it's them. Check back in a bit to see if we've smoothed things over!",
			timeout: 5000
		})
		processing.value = false
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
			await router.push("/servers")
		})
		.catch((error) => {
			console.error(error)
		}).finally(() => {
			processing.value = false
		})
}
</script>

<template>
	<button class="ms-btn ms-primary ms-medium" @click="onClicked" :disabled="processing">
		<div class="ms-loading ms-primary ms-small" v-if="processing"></div>
		Login with Plex
	</button>
</template>
