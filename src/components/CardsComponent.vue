<script setup>
import { FlashCards } from "vue3-flashcards"
import { useDataStore } from "../stores/data"

let dataStore = useDataStore()
let emit = defineEmits(["approved", "rejected"])
let props = defineProps({
	token: String,
	media: Array
})

/**
 * Emits an approved message to the parent object.
 * @param media The media item that was just voted on.
 */
function onApprove(media) {
	emit("approved", media)
}

/**
 * Emits a rejected message to the parent object.
 * @param media The media item that was just voted on.
 */
function onReject(media) {
	emit("rejected", media)
}
</script>

<template>
	<div class="cards">
		<FlashCards :items="props.media" :virtual-buffer="1" @approve="onApprove" @reject="onReject">
			<template #default="{ item }">
				<div class="card" :style="{ backgroundImage: `url(${dataStore.getMediaBoxArt(props.token, item)})` }">
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
</template>

<style scoped>
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
