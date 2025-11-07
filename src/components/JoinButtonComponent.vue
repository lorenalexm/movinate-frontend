<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useConnectionStore } from "../stores/connection"
import { useToastStore } from "../stores/toast"

let router = useRouter()
let toastStore = useToastStore()
let connectionStore = useConnectionStore()
let processing = ref(false);
let roomId = ref("")

async function onClicked() {
	processing.value = true
	connectionStore.connectSocket()
	await new Promise((resolve) => {
		setTimeout(resolve, 100)
	})
	connectionStore.joinRoom(roomId.value, async (success) => {
		if (!success) {
			toastStore.addToast({
				title: "Couldn't join room!",
				message: "It seems that code doesn't exist, maybe check it and try again."
			}, toastStore.statusType.error)
			connectionStore.disconnectSocket()
			processing.value = false
		} else {
			await router.push("/vote")
			processing.value = false
		}
	})
}
</script>

<template>
	<input v-model="roomId" placeholder="Input room code here"/>
	<button class="ms-btn ms-primary ms-medium" @click="onClicked" :disabled="processing">
		<div class="ms-loading ms-primary ms-small" v-if="processing"></div>
		Join Room
	</button>
</template>
