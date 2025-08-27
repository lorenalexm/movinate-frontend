import { vi, describe, test, expect, beforeEach } from "vitest"
import { mount } from "@vue/test-utils"
import { useRouter } from "vue-router"
import { setActivePinia, createPinia } from "pinia"
import LibraryButtonComponent from "./LibraryButtonComponent.vue"

vi.mock("vue-router")
vi.mock("../stores/connection", () => {
	return {
		useConnectionStore: () => ({
			updateUserLibrary: vi.fn((_, callback) => callback({ success: true }))
		})
	}
})

let threeLibraries = [
	{
		id: 1,
		title: "One",
		type: "movie"
	},
	{
		id: 2,
		title: "Two",
		type: "show"
	},
	{
		id: 3,
		title: "Three",
		type: "movie"
	}
]

let twoLibrariesOneHidden = [
	{
		id: 1,
		title: "One",
		type: "movie"
	},
	{
		id: 2,
		title: "Two",
		type: "show"
	},
	{
		id: 3,
		title: "Three",
		type: "music"
	}
]

let emptyLibrary = []

describe("Tests the Library Button Component", () => {
	useRouter.mockReturnValue({
		push: vi.fn()
	})

	beforeEach(() => {
		useRouter().push.mockReset()
		setActivePinia(createPinia())
	})

	test("Shows three buttons for valid library items", () => {
		expect(LibraryButtonComponent).toBeTruthy()
		let wrapper = mount(LibraryButtonComponent, {
			props: {
				libraries: threeLibraries
			}
		})
		let buttons = wrapper.findAll("button")
		expect(buttons.length).toBe(3)
	})

	test("Shows two buttons for valid library items, filtering one", () => {
		expect(LibraryButtonComponent).toBeTruthy()
		let wrapper = mount(LibraryButtonComponent, {
			props: {
				libraries: twoLibrariesOneHidden
			}
		})
		let buttons = wrapper.findAll("button")
		expect(buttons.length).toBe(2)
	})

	test("Transitions to the voting page when clicked", async () => {
		expect(LibraryButtonComponent).toBeTruthy()
		let wrapper = mount(LibraryButtonComponent, {
			props: {
				libraries: twoLibrariesOneHidden
			}
		})
		let buttons = wrapper.findAll("button")
		await buttons[0].trigger("click")
		expect(useRouter().push).toHaveBeenCalledWith("/vote")
	})

	test("Shows error message if no libraries found on server", () => {
		expect(LibraryButtonComponent).toBeTruthy()
		let wrapper = mount(LibraryButtonComponent, {
			props: {
				libraries: emptyLibrary
			}
		})
		let buttons = wrapper.findAll("button")
		expect(buttons.length).toBe(0)
		let paragraph = wrapper.find("p")
		expect(paragraph).toBeTruthy()
	})
})
