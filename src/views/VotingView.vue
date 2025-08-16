<script setup>
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useDataStore } from "../stores/data"
import { getLibraryItems } from "../libs/plex"

let router = useRouter()
let store = useDataStore()

onMounted(async () => {
	if (!store.currentLibrary) {
		router.push("/libraries")
	}

	store.media = await getLibraryItems(store.currentServer.publicAddress, store.currentLibrary.key, store.authToken)
	console.log(store.media)
})
</script>

<template>
	<div>
		<p>Voting Time!</p>
		<ul>
			<li v-for="media in store.media.Metadata" :key="media.title">
				{{ media.title }}
			</li>
		</ul>
	</div>
</template>
