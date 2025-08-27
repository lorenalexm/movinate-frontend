<script setup>
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useDataStore } from "../stores/data"
import { useConnectionStore } from "../stores/connection"
import { getLibraryItems } from "../libs/plex"

let router = useRouter()
let authStore = useAuthStore()
let dataStore = useDataStore()
let connectionStore = useConnectionStore()
let media = computed(() => dataStore.media)

onMounted(async () => {
	if (!connectionStore.socketConnected) {
		await router.push("/rooms")
		return
	}

	if (!dataStore.currentLibrary) {
		await router.push("/libraries")
		return
	}

	dataStore.media = await getLibraryItems(dataStore.currentServer.publicAddress, dataStore.currentLibrary.key, authStore.authToken)
})
</script>

<template>
	<div v-if="media">
		<p>Voting Time!</p>
		<ul>
			<li v-for="media in dataStore.media.Metadata" :key="media.title">
				{{ media.title }}
			</li>
		</ul>
	</div>
</template>
