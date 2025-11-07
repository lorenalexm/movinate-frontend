<script setup>
import { computed, ref, onMounted, getCurrentInstance } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useDataStore } from "../stores/data"
import { useToastStore } from "../stores/toast"
import { useConnectionStore } from "../stores/connection"
import { socketMessages } from "../libs/socketMessages"
import { getLibraryItems } from "../libs/plex"

let router = useRouter()
let authStore = useAuthStore()
let dataStore = useDataStore()
let toastStore = useToastStore()
let connectionStore = useConnectionStore()
let { $socket } = getCurrentInstance().appContext.config.globalProperties
let media = computed(() => dataStore.media)
let userCount = ref(0)

/**
 * Updates the {@link userCount} reference.
 * @param data The current count of users in the room.
 */
function onUserCountUpdated(data) {
	userCount.value = data.count
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

	if (!dataStore.currentLibrary) {
		await router.push("/libraries")
		toastStore.warning({
			title: "No Library Selected!",
			message: "Looks like we don't have a library selected, let's choose one now."
		})
		return
	}

	dataStore.media = await getLibraryItems(dataStore.currentServer.publicAddress, dataStore.currentLibrary.key, authStore.authToken)
	$socket.on(socketMessages.userCount, onUserCountUpdated)
	$socket.emit(socketMessages.requestUserCount, connectionStore.roomId)
})
</script>

<template>
	<div v-if="media">
		<p>Voting Time!</p>
		<p v-if="userCount > 0">There are currently {{ userCount }} users voting in this room!</p>
		<p>The room Id for others to join is: {{ connectionStore.roomId }}</p>
		<ul>
			<li v-for="media in dataStore.media.Metadata" :key="media.title">
				{{ media.title }}
			</li>
		</ul>
	</div>
	<div v-else>
		<p>Loading</p>
	</div>
</template>
