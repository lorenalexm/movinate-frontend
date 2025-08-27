import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"

/**
 * Provides access and syncing values of the authToken from the localStorage.
 */
export let useAuthStore = defineStore("auth", () => {
	let authToken = useStorage("authToken", "")
	return { authToken }
})
