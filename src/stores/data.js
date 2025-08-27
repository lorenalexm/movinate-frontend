import { defineStore } from "pinia"

export let useDataStore = defineStore("data", {
	state: () => ({
		servers: [],
		currentServer: null,
		libraries: [],
		currentLibrary: null,
		media: []
	})
})
