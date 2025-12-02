<script setup>
import { ref, onMounted, getCurrentInstance } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useDataStore } from "../stores/data"
import { useToastStore } from "../stores/toast"
import { useConnectionStore } from "../stores/connection"
import { socketMessages } from "../libs/socketMessages"
import { getLibraryItems } from "../libs/plex"
import CardsComponent from "../components/CardsComponent.vue"
import MediaListComponent from "../components/MediaListComponent.vue"

let router = useRouter()
let authStore = useAuthStore()
let dataStore = useDataStore()
let toastStore = useToastStore()
let connectionStore = useConnectionStore()
let { $socket } = getCurrentInstance().appContext.config.globalProperties
let media = ref([])
let approved = ref([])
let rejected = ref([])
let userCount = ref(0)
let token = ref("")

/**
 * Updates the {@link userCount} reference.
 * @param data The current count of users in the room.
 */
function onUserCountUpdated(data) {
	userCount.value = data.count
}

/**
 * Informs other clients of the media vote.
 * Will send media metrics to the server.
 * @param media The media item that was just voted on.
 */
function onApprove(media) {
	$socket.emit(socketMessages.upvote, media.ratingKey)
	approved.value.push(media)
}

/**
 * Will send media metrics to the server.
 * @param media The media item that was just voted on.
 */
function onReject(media) {
	rejected.value.push(media)
}

/**
 * Informs the user that a consensus has been reached by all other voters.
 * @param mediaId The Id of the media item that was voted on by all users.
 */
function onConsensusReached(mediaId) {
	console.log("Consensus has been reached!")
	console.log(`The chosen media is ${mediaId}`)
}

/**
 * Takes an array and shuffles it in place.
 * @param array The array to be shuffled.
 */
function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var random = Math.floor(Math.random() * (i + 1));
		[array[i], array[random]] = [array[random], array[i]];
	}
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

	token.value = authStore.authToken ?? dataStore.currentServer.accessToken
	dataStore.media = await getLibraryItems(dataStore.currentServer.publicAddress, dataStore.currentLibrary.key, token.value)
	media.value = dataStore.media.Metadata
	shuffle(media.value)
	$socket.on(socketMessages.userCount, onUserCountUpdated)
	$socket.on(socketMessages.consensusReached, onConsensusReached)
	$socket.emit(socketMessages.requestUserCount, connectionStore.roomId)
})
</script>

<template>
	<div v-if="media.length > 0">
		<p>Voting Time!</p>
		<p v-if="userCount > 0">There are currently {{ userCount }} users voting in this room!</p>
		<p>The room Id for others to join is: {{ connectionStore.roomId }}</p>

		<div class="container">
			<div class="row">
				<div class="col">
					<MediaListComponent :media="rejected" :token="token" />
				</div>

				<div class="col">
					<CardsComponent :media="media" :token="token" @approved="onApprove" @rejected="onReject" />
				</div>

				<div class="col">
					<MediaListComponent :media="approved" :token="token" />
				</div>
			</div>
		</div>
	</div>
	<div v-else>
		<p>Loading</p>
	</div>
</template>
