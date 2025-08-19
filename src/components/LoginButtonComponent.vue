<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { getLoginUrl, loginCheck } from "../libs/plex"
import { useConnectionStore } from "../stores/connection"
import { useAuthStore } from "../stores/auth"

let router = useRouter()
let processing = ref(false);
let connectionStore = useConnectionStore()
let authStore = useAuthStore()

/**
 * Takes the user through the Plex.tv login flow.
 * Connects to the socket server if login successful or authToken already stored.
 * Redirects to the Rooms view if authToken already stored.
 */
async function onClicked() {
	processing.value = true;

	if (authStore.authToken) {
		connectionStore.connectSocket()
		await router.push("/rooms")
		return
	}

	let data = await getLoginUrl()
	if (!data) {
		return
	}

	window.open(data.uri, "_blank").focus()
	loginCheck(data.id, data.code)
		.then((authToken) => {
			authStore.authToken = authToken
			connectionStore.connectSocket()
			router.push("/rooms")
		})
		.catch((error) => {
			console.error(error)
		}).finally(() => {
			processing.value = false
		})
}
</script>

<template>
	<div>
		<button class="ms-btn ms-primary ms-medium" @click="onClicked" :disabled="processing">
			<div class="ms-loading ms-primary ms-small" v-if="processing"></div>
			Login with Plex
		</button>
	</div>
</template>
