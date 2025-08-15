import HomeView from "./views/HomeView.vue"
import LibrariesView from "./views/LibrariesView.vue"
import ServersView from "./views/ServersView.vue"
import VotingView from "./views/VotingView.vue"

export let routes = [
	{
		path: "/",
		component: HomeView
	},
	{
		path: "/servers",
		component: ServersView,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/libraries",
		component: LibrariesView,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/vote",
		component: VotingView,
		meta: {
			requiresAuth: true
		}
	}
]
