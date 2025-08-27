import { vi, describe, test, expect, beforeEach } from "vitest"
import { mount } from "@vue/test-utils"
import { useRouter } from "vue-router"
import { setActivePinia, createPinia } from "pinia"
import ServerButtonComponent from "./ServerButtonComponent.vue"

vi.mock("vue-router")
vi.mock("../stores/connection", () => {
	return {
		useConnectionStore: () => ({
			updateUserServer: vi.fn((_, callback) => callback({ success: true }))
		})
	}
})

let twoServers = [
	{
		id: 1,
		name: "One"
	},
	{
		id: 2,
		name: "Two"
	}
]

let emptyServer = []

describe("Tests the Server Button Component", () => {
	useRouter.mockReturnValue({
		push: vi.fn()
	})

	beforeEach(() => {
		useRouter().push.mockReset()
		setActivePinia(createPinia())
	})

	test("Shows two buttons for valid server items", () => {
		expect(ServerButtonComponent).toBeTruthy()
		let wrapper = mount(ServerButtonComponent, {
			props: {
				servers: twoServers
			}
		})
		let buttons = wrapper.findAll("button")
		expect(buttons.length).toBe(2)
	})

	test("Shows error message if no servers found", () => {
		expect(ServerButtonComponent).toBeTruthy()
		let wrapper = mount(ServerButtonComponent, {
			props: {
				servers: emptyServer
			}
		})
		let buttons = wrapper.findAll("button")
		expect(buttons.length).toBe(0)
		let paragraph = wrapper.find("p")
		expect(paragraph).toBeTruthy()
	})
})
