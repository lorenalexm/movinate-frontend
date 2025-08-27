<script setup>
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth"
import { useDataStore } from "../stores/data"
import { useConnectionStore } from "../stores/connection"
import { useToastStore } from "../stores/toast"
import { getServerList } from "../libs/plex"
import ServerButtonComponent from "../components/ServerButtonComponent.vue"

let router = useRouter()
let authStore = useAuthStore()
let dataStore = useDataStore()
let connectionStore = useConnectionStore()
let toastStore = useToastStore()
let servers = computed(() => dataStore.servers)

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
	<div v-if="servers">
		<div class="ms-card ms-fill">
			<div class="ms-card-title">
				<h3>🌐 Pick a Server</h3>
			</div>
			<div class="ms-card-content">
				<p>
					This is where your movie magic lives. Just tap the server you want to use — it’s literally that easy. 
					No dropdowns, no confusing setup, just a list of your servers waiting to party. 🎉
				</p>
			</div>
		</div>
		<ServerButtonComponent :servers="servers"/>
	</div>
</template>
