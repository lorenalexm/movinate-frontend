<script setup>
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useDataStore } from "../stores/data"
import { useConnectionStore } from "../stores/connection"
import { getLibraryList } from "../libs/plex"

let router = useRouter()
let authStore = useAuthStore()
let dataStore = useDataStore()
let connectionStore = useConnectionStore()
let libraries = computed(() => dataStore.libraries)

/**
 * Sets the current library within the store, and redirects to the voting view.
 * @param library The library to be set as current.
 */
function onClicked(library) {
	connectionStore.updateUserLibrary(library, (success, message) => {
		if (success) {
			router.push("/vote")
		} else {
			console.error(message)
		}
	})
}

onMounted(async () => {
	if (!connectionStore.socketConnected) {
		await router.push("/rooms")
		return
	}
	
	if (!dataStore.currentServer) {
		await router.push("/servers")
		return
	}

	dataStore.libraries = await getLibraryList(dataStore.currentServer.publicAddress, authStore.authToken)
})
</script>

<template>
	<div v-if="libraries">
		<p>Libraries View</p>
		<button v-for="library in libraries.filter(library => (library.type == 'movie' || library.type == 'show'))" :key="library.key" @click="onClicked(library)" class="ms-btn ms-primary ms-medium">
			{{ library.title }}
		</button>
	</div>
</template>
