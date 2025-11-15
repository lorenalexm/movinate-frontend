import { defineStore } from "pinia"

export let useDataStore = defineStore("data", {
	state: () => ({
		servers: [],
		currentServer: null,
		remoteServerConnection: null,
		libraries: [],
		currentLibrary: null,
		media: []
	}),
	actions: {
		/**
		 * Attempts to find an open remote connection from the server.
		 * @returns An object containing the details of the remote connection to the server. Null if none found.
		 */
		getRemoteServerConnection() {
			if (this.remoteServerConnection) {
				return this.remoteServerConnection
			}
			
			if (!this.currentServer) {
				console.error("Current server has not been set.")
				return null
			}

			let connection = this.currentServer.connections.find((connection) => {
				return connection.local == false
			})

			if (!connection) {
				console.error("Unable to find remote connection from the server.")
				return null
			}

			this.remoteServerConnection = connection
			return connection
		},
		/**
		 * Creates a URL for a media's boxart using an available remote server.
		 * @param {string} token The Plex.tv token for access to a server.
		 * @param {Object} media The media object.
		 * @returns A URL string for a media's boxart, if available. Null if no connection to server.
		 */
		getMediaBoxArt(token, media) {
			let connection = this.getRemoteServerConnection()
			if(!connection) {
				return null
			}
			return `${connection.uri}${media.thumb}?X-Plex-Token=${token}`
		}
	}
})
