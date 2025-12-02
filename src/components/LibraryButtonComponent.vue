<script setup>
import { useRouter } from "vue-router"
import { useConnectionStore } from "../stores/connection"

let props = defineProps(["libraries"])
let router = useRouter()
let connectionStore = useConnectionStore()

/**
 * Sets the current library within the store, and redirects to the voting view.
 * @param library The library to be set as current.
 */
function onClicked(library) {
	connectionStore.updateUserLibrary(library, (success, message) => {
		if (success) {
			router.push("/vote")
		} else {
			console.error(message)
		}
	})
}
</script>

<template>
	<div v-if="props.libraries.length">
		<button v-for="library in props.libraries.filter(library => (library.type == 'movie' || library.type == 'show'))" :key="library.key" @click="onClicked(library)" class="ms-btn ms-primary ms-medium">
			{{ library.title }}
		</button>
	</div>
	<div v-else>
		<p>Well this is odd, we cannot seem to find any libraries for that server.</p>
	</div>
</template>
