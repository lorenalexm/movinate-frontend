import { createApp } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import { createPinia } from "pinia"
import App from "./App.vue"
import { routes } from "./routes"
import { useAuthStore } from "./stores/auth"
import { useToastStore } from "./stores/toast"
import sockets from "./plugins/socket"

let router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to) => {
	let authStore = useAuthStore()
	let toastStore = useToastStore()
	if (to.meta.requiresAuth && !authStore.authToken) {
		toastStore.error({
			title: "Not logged in!",
			message: "It seems at some point you were logged out. Let's get you voting again!"
		})
		return "/"
	}
})

let app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(sockets)
app.mount("#app")
