import { defineStore } from "pinia"
import { socket } from "../plugins/socket"
import { useDataStore } from "./data"

/**
 * When a new room is created. This is an optional callback
 * 
 * @callback createRoomCallback
 */

/**
 * When a user has their Plex.tv server updated.
 * 
 * @callback setUserServerCallback
 * @param {boolean} success Did the socket server respond successfully.
 * @param {string} message Any message tied to the success status.
 */

/**
 * When a user has their Plex.tv library updated.
 * 
 * @callback setUserLibraryCallback
 * @param {boolean} success Did the socket server respond successfully.
 * @param {string} message Any message tied to the success status.
 */

export let useConnectionStore = defineStore("connection", {
	state: () => ({
		dataStore: useDataStore(),
		socketConnected: false,
		roomId: null
	}),
	actions: {
		/**
		 * Attempts a connection to the socket server.
		 * Toggles the connection boolean based on success.
		 */
		connectSocket() {
			if (!this.socketConnected) {
				socket.connect()

				socket.on("connect", () => {
					this.socketConnected = true
				})

				socket.on("disconnect", () => {
					this.socketConnected = false
				})
			}
		},
		/**
		 * If there is an active connection, disconnects.
		 */
		disconnectSocket() {
			if (this.socketConnected) {
				socket.disconnect()
			}
		},
		/**
		 * Creates a new room on the server and saves the id received.
		 * @param {createRoomCallback} callback {@link createRoomCallback}
		 */
		createRoom(callback = null) {
			if (this.socketConnected) {
				socket.emit("createRoom", (response) => {
					this.roomId = response.id
					callback?.()
				})
			}
		},
		/**
		 * Attempts to update the server of the remote socket user.
		 * If successful updates the data store with the server, from the parameter.
		 * @param {Object} server A server currently available to the user.
		 * @param {setUserServerCallback} callback {@link setUserServerCallback}
		 */
		updateUserServer(server, callback) {
			if (this.socketConnected) {
				socket.emit("setUserServer", server, (response) => {
					if (response.success) {
						this.dataStore.currentServer = server
					}

					callback(response.success, response.message)
				})
			}
		},
		/**
		 * Attempts to update the library of the remote socket user.
		 * If successful updates the data store with the library, from the parameter.
		 * @param {Object} library 
		 * @param {setUserLibraryCallback} callback {@link setUserLibraryCallback}
		 */
		updateUserLibrary(library, callback) {
			if (this.socketConnected) {
				socket.emit("setUserLibrary", library, (response) => {
					if (response.success) {
						this.dataStore.currentLibrary = library
					}

					callback(response.success, response.message)
				})
			}
		}
	}
})
