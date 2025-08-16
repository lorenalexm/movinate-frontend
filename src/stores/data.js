import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"

export let useDataStore = defineStore("app", {
	state: () => ({
		authToken: useStorage("authToken", ""),
		servers: [],
		currentServer: null,
		libraries: [],
		currentLibrary: null,
		media: []
	})
})
