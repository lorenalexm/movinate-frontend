import { createApp } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import { createPinia } from "pinia"
import App from "./App.vue"
import { routes } from "./routes"

let router = createRouter({
	history: createWebHistory(),
	routes
})

let app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount("#app")
