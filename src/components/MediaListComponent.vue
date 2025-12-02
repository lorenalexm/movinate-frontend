<script setup>
import { useDataStore } from "../stores/data"

let dataStore = useDataStore()
let props = defineProps({
	token: String,
	media: Array
})
</script>

<template>
	<div>
		<div v-for="item in props.media" :key="item.ratingKey" :style="{ backgroundImage: `url(${dataStore.getMediaBoxArt(props.token, item)})` }" class="card">
			<div class="blurred-background">
				<h6>{{ item.title }}</h6>
			</div>
		</div>
	</div>
</template>

<style scoped>
.card {
	margin-top: 8px;
	user-select: none;
	background-position: center;
	background-size: cover;
	border-radius: 8px;
	padding: 4px;
}

.card .blurred-background {
	text-align: center;
	border-radius: 12px;
	background-color: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
}

.card .blurred-background h6 {
	padding: 4px;
}
</style>
