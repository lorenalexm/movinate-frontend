import { createApp } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import { createPinia } from "pinia"
import App from "./App.vue"
import { routes } from "./routes"
import { useStore } from "./stores"

let router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to) => {
	let store = useStore()
	if (to.meta.requiresAuth && !store.authToken) {
		return "/"
	}
})

let app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount("#app")
