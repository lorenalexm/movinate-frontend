<script setup>
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useDataStore } from "../stores/data"
import { getLibraryList } from "../libs/plex"

let router = useRouter()
let store = useDataStore()
let libraries = computed(() => store.libraries)

/**
 * Sets the current library within the store, and redirects to the voting view.
 * @param library The library to be set as current.
 */
function onClicked(library) {
	store.currentLibrary = library
	router.push("/vote")
}

onMounted(async () => {
	if (!store.currentServer) {
		await router.push("/servers")
	}
	store.libraries = await getLibraryList(store.currentServer.publicAddress, store.authToken)
})
</script>

<template>
	<div>
		<p>Libraries View</p>
		<button v-for="library in libraries.filter(library => (library.type == 'movie' || library.type == 'show'))" :key="library.key" @click="onClicked(library)" class="ms-btn ms-primary ms-medium">
			{{ library.title }}
		</button>
	</div>
</template>
