import { defineStore } from "pinia"

export let useDataStore = defineStore("app", {
	state: () => ({
		servers: [],
		currentServer: null,
		libraries: [],
		currentLibrary: null,
		media: []
	})
})
