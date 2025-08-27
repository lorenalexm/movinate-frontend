import { describe, test, expect, beforeEach } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useToastStore } from "./toast"

describe("Tests the Toast Pinia Store.", () => {
	let store = null

	beforeEach(() => {
		setActivePinia(createPinia())
		store = useToastStore()
	})

	test("Adding a new toast to the store.", () => {
		expect(store.toasts.length).toBe(0)
		store.addToast({ title: "Toast", message: "New toast!" }, store.statusType.info)
		expect(store.toasts.length).toBe(1)
		expect(store.toasts[0].status).toBe(store.statusType.info)
	})

	test("Toast is removed after its timeout", async () => {
		expect(store.toasts.length).toBe(0)
		store.addToast({ title: "Toast", message: "New toast!", timeout: 5 }, store.statusType.info)
		expect(store.toasts.length).toBe(1)
		expect(store.toasts[0].status).toBe(store.statusType.info)
		await new Promise(resolve => setTimeout(resolve, 10))
		expect(store.toasts.length).toBe(0)
	})

	test("Toast is removed by request before timeout", () => {
		expect(store.toasts.length).toBe(0)
		store.addToast({ title: "Toast", message: "New toast!", timeout: 5000 }, store.statusType.info)
		expect(store.toasts.length).toBe(1)
		expect(store.toasts[0].status).toBe(store.statusType.info)
		store.removeToast(store.toasts[0].id)
		expect(store.toasts.length).toBe(0)
	})
})
