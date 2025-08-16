<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { getLoginUrl, loginCheck } from "../libs/plex"
import { useAuthStore } from "../stores/auth"

let router = useRouter()
let processing = ref(false);
let store = useAuthStore()

/**
 * Takes the user through the Plex.tv login flow.
 * Redirects to the Servers view if authToken already stored.
 */
async function onClicked() {
	processing.value = true;

	if (store.authToken) {
		await router.push("/servers")
		return
	}

	let data = await getLoginUrl()
	if (!data) {
		return
	}

	window.open(data.uri, "_blank").focus()
	loginCheck(data.id, data.code)
		.then((authToken) => {
			store.authToken = authToken
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
	<div>
		<button class="ms-btn ms-primary ms-medium" @click="onClicked" :disabled="processing">
			<div class="ms-loading ms-primary ms-small" v-if="processing"></div>
			Login with Plex
		</button>
	</div>
</template>
