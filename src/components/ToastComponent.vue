<script setup>
import { useToastStore } from "../stores/toast"

let store = useToastStore()

/**
 * Sets the background of the toast based on the severity.
 * @param toast The toast object.
 */
function background(toast) {
	return {
		"ms-secondary": toast.status == store.statusType.info,
		"ms-action": toast.status == store.statusType.success,
		"ms-action2": toast.status == store.statusType.warning,
		"ms-primary": toast.status == store.statusType.error
	}
}

/**
 * Signals the {@link useToastStore} to close the given toast.
 * @param toast The toast to be closed.
 */
function onClick(toast) {
	store.removeToast(toast.id)
}
</script>

<template>
	<Teleport to="body">
		<Transition name="toast">
			<div v-if="store.toasts.length > 0">
				<TransitionGroup name="toast" tag="div">
					<div v-for="toast in store.toasts" :key="toast.id">
						<div class="ms-alert" :class="background(toast)">
							<span class="ms-close" @click="onClick(toast)"></span>
							<h5>{{ toast.title }}</h5>
							<p>{{ toast.message }}</p>
						</div>
					</div>
				</TransitionGroup>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.toast {
	position: fixed;
	bottom: 1rem;
	right: 1rem;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.toast-enter-from,
.toast-leave-to {
	opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
	transition: 0.25s ease all;
}
</style>
