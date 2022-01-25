<script>
	// import Router from './route/index.svelte'
	import { Router, Route } from "svelte-navigator";

	import Login from './pages/auth/login.svelte'
    import Admin from './pages/superAdmin/adminLander.svelte'
	import Marketer from './pages/marketer/mainLander.svelte'
</script>

<main class="body">
	<Router>
		<div>
			<Route path="/" component={Login}/>
			<Route path="admin/*" component={Admin} primary={false}/>
			<Route path="marketer/*" component={Marketer} primary={false}/>
		</div>
	</Router>
</main>
<style>
	@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@200&display=swap');
	.body{
		font-family: 'Fira Sans', sans-serif;
		/* background-image: url("/assert/bkg.png"); */
		height: 110vh;
		background-attachment: fixed;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>