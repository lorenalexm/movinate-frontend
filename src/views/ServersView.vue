<script setup>
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth"
import { useDataStore } from "../stores/data"
import { useConnectionStore } from "../stores/connection"
import { useToastStore } from "../stores/toast"
import { getServerList } from "../libs/plex"

let router = useRouter()
let authStore = useAuthStore()
let dataStore = useDataStore()
let connectionStore = useConnectionStore()
let toastStore = useToastStore()
let servers = computed(() => dataStore.servers)

/**
 * Sets the current server within the store, and redirects to the libraries view.
 * @param server The server to be set as current.
 */
function onClicked(server) {
	connectionStore.updateUserServer(server, (success, message) => {
		if (success) {
			router.push("/libraries")
		} else {
			console.error(message)
		}
	})
}

onMounted(async () => {
	if (!connectionStore.socketConnected) {
		await router.push("/")
		toastStore.error({
			title: "Unable to connect!",
			message: "Something went wrong, and we cannot connect to the server!"
		})
		return
	}
	dataStore.servers = await getServerList(authStore.authToken)
})
</script>

<template>
	<div>
		<p>Servers View</p>
		<div>
			<button v-for="server in servers" :key="server.clientIdentifier" @click="onClicked(server)" class="ms-btn ms-primary ms-medium">
				{{ server.name }}
			</button>
		</div>
	</div>
</template>
