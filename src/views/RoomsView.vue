<script setup>
import { useRouter } from "vue-router"
import { onMounted } from "vue"
import { useConnectionStore } from "../stores/connection"

let router = useRouter()
let store = useConnectionStore()

function onCreateClicked() {
	store.createRoom(() => {
		router.push("/servers")
	})
}

onMounted(() => {
	if (!store.socketConnected) {
		store.connectSocket()
	}
})
</script>

<template>
	<div>
		<p>Rooms!</p>
		<button @click="onCreateClicked">Create Room</button>
	</div>
</template>
