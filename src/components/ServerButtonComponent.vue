<script setup>
import { defineProps } from "vue"
import { useRouter } from "vue-router"
import { useConnectionStore } from "../stores/connection"

let props = defineProps(["servers"])
let router = useRouter()
let connectionStore = useConnectionStore()

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
</script>

<template>
	<div v-if="props.servers.length">
		<button v-for="server in props.servers" :key="server.clientIdentifier" @click="onClicked(server)" class="ms-btn ms-primary ms-medium">
			{{ server.name }}
		</button>
	</div>
	<div v-else>
		<p>Interesting.. It appears as though you don't have access to any Plex.tv servers.</p>
	</div>
</template>
