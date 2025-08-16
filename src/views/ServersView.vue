<script setup>
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router";
import { useDataStore } from "../stores/data"
import { getServerList } from "../libs/plex";

let router = useRouter()
let store = useDataStore()
let servers = computed(() => store.servers)

/**
 * Sets the current server within the store, and redirects to the libraries view.
 * @param server The server to be set as current.
 */
function onClicked(server) {
	store.currentServer = server
	router.push("/libraries")
}

onMounted(async () => {
	store.servers = await getServerList(store.authToken)
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
