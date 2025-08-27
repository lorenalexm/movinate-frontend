import { defineStore } from "pinia"

export let useToastStore = defineStore("toast", {
	state: () => ({
		defaultTimeout: 3000,
		toasts: [],
		statusType: Object.freeze({
			/** Informative messages that can usually be safely ignored. */
			info: "info",
			/** When a positive action takes place, should be acknowledged but not needed. */
			success: "success",
			/** Something went amiss, needs to be checked probably interaction required. */
			warning: "warning",
			/** A complete failure, will need manual resolution. */
			error: "error"
		})
	}),
	actions: {
		/**
		 * Creates a toast object and adds it to the active toasts.
		 * Sets a timer to remove after a given timeout, or the default of 3 seconds.
		 * @param {Object} data An object containing the details for this toast.
		 * @param {string} data.title A glanceable title for why the toast is shown.
		 * @param {string} data.message The longer message describing why the toast was shown.
		 * @param {number} [data.timeout] The time before the toast is removed.
		 * @param {*} status The severity of this toast.
		 */
		addToast(data, status) {
			let toast = {
				...data,
				status,
				id: Math.random() * 1000
			}

			this.toasts.push(toast)
			setTimeout(() => {
				this.toasts = this.toasts.filter((existing) => existing.id != toast.id)
			}, toast.timeout ?? this.defaultTimeout)
		},

		/**
		 * Filters out an active toast from the array based on its id.
		 * @param {number} id The id of a currently active toast.
		 */
		removeToast(id) {
			this.toasts = this.toasts.filter((existing) => existing.id != id)
		},

		/**
		 * Toast helper to create an info toast.
		 * @param {Object} data An object containing the details for this toast.
		 * @param {string} data.title A glanceable title for why the toast is shown.
		 * @param {string} data.message The longer message describing why the toast was shown.
		 * @param {number} [data.timeout] The time before the toast is removed.
		 */
		info(data) {
			this.addToast(data, this.statusType.info)
		},

		/**
		 * Toast helper to create a success toast.
		 * @param {Object} data An object containing the details for this toast.
		 * @param {string} data.title A glanceable title for why the toast is shown.
		 * @param {string} data.message The longer message describing why the toast was shown.
		 * @param {number} [data.timeout] The time before the toast is removed.
		 */
		success(data) { 
			this.addToast(data, this.statusType.success)
		},

		/**
		 * Toast helper to create a warning toast.
		 * @param {Object} data An object containing the details for this toast.
		 * @param {string} data.title A glanceable title for why the toast is shown.
		 * @param {string} data.message The longer message describing why the toast was shown.
		 * @param {number} [data.timeout] The time before the toast is removed.
		 */
		warning(data) {
			this.addToast(data, this.statusType.warning)
		},

		/**
		 * Toast helper to create an error toast.
		 * @param {Object} data An object containing the details for this toast.
		 * @param {string} data.title A glanceable title for why the toast is shown.
		 * @param {string} data.message The longer message describing why the toast was shown.
		 * @param {number} [data.timeout] The time before the toast is removed.
		 */
		error(data) {
			this.addToast(data, this.statusType.error)
		}
	}
})
