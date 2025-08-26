import { vi, describe, test, expect, beforeEach, afterEach } from "vitest"
import { mount } from "@vue/test-utils"
import { useRouter } from "vue-router"
import { setActivePinia, createPinia } from "pinia"
import { useAuthStore } from "../stores/auth"
import HeaderComponent from "./HeaderComponent.vue"

vi.mock("vue-router")

describe("Tests the Header Component.", () => {
	let authStore = null
	useRouter.mockReturnValue({
		push: vi.fn()
	})

	beforeEach(() => {
		useRouter().push.mockReset()
		setActivePinia(createPinia())
		authStore = useAuthStore()
	})

	afterEach(() => {
		authStore.authToken = null
	})

	test("Mounts the component", () => {
		expect(HeaderComponent).toBeTruthy()
		let wrapper = mount(HeaderComponent)
		let paragraph = wrapper.find("p")
		expect(paragraph.exists()).toBe(true)
		expect(paragraph.text()).toContain("Movinate")
	})

	test("Does not show logout button without an auth token", () => {
		expect(HeaderComponent).toBeTruthy()
		let wrapper = mount(HeaderComponent)
		let button = wrapper.find("button")
		expect(button.exists()).toBe(false)
	})

	test("Shows the logout button with auth token", () => {
		authStore.authToken = "token"
		expect(HeaderComponent).toBeTruthy()
		let wrapper = mount(HeaderComponent)
		let button = wrapper.find("button")
		expect(button.exists()).toBe(true)
		expect(button.text()).toContain("Logout")
	})

	test("Removes the auth token when the button is clicked", async () => {
		authStore.authToken = "token"
		expect(HeaderComponent).toBeTruthy()
		let wrapper = mount(HeaderComponent)
		let button = wrapper.find("button")
		expect(button.exists()).toBe(true)
		await button.trigger("click")
		expect(authStore.authToken).toBeFalsy()
		button = wrapper.find("button")
		expect(button.exists()).toBe(false)
		expect(useRouter().push).toHaveBeenCalledWith("/")
	})
})
