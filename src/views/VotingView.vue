<script setup>
import { ref, onMounted, getCurrentInstance } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useDataStore } from "../stores/data"
import { useToastStore } from "../stores/toast"
import { useConnectionStore } from "../stores/connection"
import { socketMessages } from "../libs/socketMessages"
import { getLibraryItems } from "../libs/plex"
import { FlashCards } from "vue3-flashcards"

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
}

/**
 * Will attempt to pull the boxart of the media item from the owners server.
 * @param media The media item to pull box art.
 */
function getMediaThumbnail(media) {
	let server = dataStore.currentServer.connections.find((connection) => {
		return connection.local == false
	})
	return `${server.uri}${media.thumb}?X-Plex-Token=${token.value}`
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
					<ul>
						<li v-for="media in rejected" :key="media.ratingKey">
							{{ media.title }}
						</li>
					</ul>
				</div>

				<div class="col">
					<div class="cards">
						<FlashCards :items="media" :virtual-buffer="1" @approve="onApprove" @reject="onReject">
							<template #default="{ item }">
								<div class="card" :style="{ backgroundImage: `url(${getMediaThumbnail(item)})` }">
									<div class="ms-card fullheight">
										<div class="blurred-background">
										<div class="ms-card-title">
											<h3>{{ item.title }}</h3>
										</div>
										<div class="ms-card-body">
											<p>{{ item.summary }}</p>
										</div>
										</div>
										<div class="ms-card-button">
											<button class="ms-btn ms-action">Reject</button>
											<button class="ms-btn ms-action2">Approve</button>
										</div>
									</div>
								</div>
							</template>
							<template #approve="{ delta }">
								<div class="approve" :style="{ opacity: delta }">
									<p>👌</p>
								</div>
							</template>
							<template #reject="{ delta }">
								<div class="reject" :style="{ opacity: delta }">
									<p>🙅‍♀️</p>
								</div>
							</template>
						</FlashCards>
					</div>
				</div>

				<div class="col">
					<ul>
						<li v-for="media in approved" :key="media.ratingKey">
							{{ media.title }}
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div v-else>
		<p>Loading</p>
	</div>
</template>

<style lang="css" scoped>
.cards {
	padding-top: 0px;
}

.cards .reject {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(197, 80, 37, 0.9);
	border-radius: 8px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 6rem;
}

.cards .approve {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(175, 211, 58, 0.9);
	border-radius: 8px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 6rem;
}

.card {
	aspect-ratio: 2/3;
	user-select: none;
	background-position: center;
	background-size: cover;
	border-radius: 8px;
	padding: 16px;
}

.card .blurred-background {
	border-radius: 12px;
	padding: 4px;
	margin-bottom: 8px;
	background-color: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
}

.fullheight {
	height: 100%;
}
</style>
