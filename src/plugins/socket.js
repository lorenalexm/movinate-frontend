import { io } from "socket.io-client"

export let socket = io(import.meta.env.VITE_SOCKET_HOST, {
	autoConnect: false,
	transports: [
		"websocket"
	]
})

export default {
	install: (app) => {
		app.config.globalProperties.$socket = socket
	}
}
