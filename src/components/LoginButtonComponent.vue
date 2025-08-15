<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router";
import { getLoginUrl, loginCheck } from "../lib/plex"

const router = useRouter()
const processing = ref(false);

async function onLoginClicked() {
	processing.value = true;
	let data = await getLoginUrl()
	if (!data) {
		return
	}

	window.open(data.uri, "_blank").focus()
	loginCheck(data.id, data.code)
		.then((authCode) => {
			localStorage.setItem("authCode", authCode);
			router.push("/servers")
		})
		.catch((error) => {
			console.error(error)
		}).finally(() => {
			processing.value = false;
		})
}
</script>

<template>
	<div>
		<button class="ms-btn ms-primary ms-medium" @click="onLoginClicked" :disabled="processing">
			<div class="ms-loading ms-primary ms-small" v-if="processing"></div>
			Login with Plex
		</button>
	</div>
</template>
