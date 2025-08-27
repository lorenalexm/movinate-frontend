<script setup>
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useDataStore } from "../stores/data"
import { useToastStore } from "../stores/toast"
import { useConnectionStore } from "../stores/connection"
import { getLibraryList } from "../libs/plex"
import LibraryButtonComponent from "../components/LibraryButtonComponent.vue"

let router = useRouter()
let authStore = useAuthStore()
let dataStore = useDataStore()
let toastStore = useToastStore()
let connectionStore = useConnectionStore()
let libraries = computed(() => dataStore.libraries)

onMounted(async () => {
	if (!connectionStore.socketConnected) {
		await router.push("/")
		toastStore.error({
			title: "Unable to connect!",
			message: "Something went wrong, and we cannot connect to the server!"
		})
		return
	}
	
	if (!dataStore.currentServer) {
		await router.push("/servers")
		toastStore.warning({
			title: "No Server Selected!",
			message: "Looks like we don't have a server selected, let's choose one now."
		})
		return
	}

	dataStore.libraries = await getLibraryList(dataStore.currentServer.publicAddress, authStore.authToken)
})
</script>

<template>
	<div v-if="libraries">
		<div class="ms-card ms-fill">
			<div class="ms-card-title">
				<h3>🎞️ Pick a Library</h3>
			</div>
			<div class="ms-card-content">
				<p>
					Just one last step! Choose the movie library you want to pull from. 
					You’ll see all the good stuff that lives there — we’re talking your action-packed epics, your cringe comedies, your guilty pleasures. Hit a button and boom, you’re in. 
					No wrong answers here. Unless you pick the "Kids Movies Only" library for horror night. Then we might judge you a little.
				</p>
			</div>
		</div>
		<LibraryButtonComponent :libraries="libraries" />
	</div>
</template>
