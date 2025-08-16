import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"

/**
 * Provides access and syncing values of the authToken from the localStorage.
 */
export const useAuthStore = defineStore("auth", () => {
	const authToken = useStorage("authToken", "")
	return { authToken }
})
