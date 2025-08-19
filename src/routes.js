import HomeView from "./views/HomeView.vue"
import RoomsView from "./views/RoomsView.vue"
import ServersView from "./views/ServersView.vue"
import LibrariesView from "./views/LibrariesView.vue"
import VotingView from "./views/VotingView.vue"

export let routes = [
	{
		path: "/",
		component: HomeView
	},
	{
		path: "/rooms",
		component: RoomsView,
		meta: {
			requiresAuth: true
		}
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
