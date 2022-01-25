<script>
    import { onMount } from 'svelte';
    import { Router, Route,Link,navigate} from "svelte-navigator";
    import NavBar from '../../component/navBar.svelte'
	
    import Home from './orders/order.svelte'
    import Print from './orders/print.svelte'
    import First from './orders/firstpay.svelte'
    import Confirm from './orders/confirmed.svelte'
    import Second from './orders/second.svelte'
    import Completed from './orders/completed.svelte'
    import ProductView from './product/products.svelte'
    import ProductSearch from './product/search.svelte'
    import UserList from './user/users.svelte'
    import UserView from './user/userView.svelte'
    import Profile from './profile.svelte'

    let isMarketer = false;
    const userDetail = JSON.parse(localStorage.getItem('admin_details'))
    const timeNow = Math.floor(Date.now()/1000)

    onMount(() => {
        const decodeToken = JSON.parse(atob(userDetail.token.split(".")[1]));
        if(decodeToken.exp > timeNow){
            isMarketer = true
        }else{
            navigate('/')
            localStorage.removeItem('admin_details')
        }

        // if(userDetail == null || userDetail == 'null'){
        //     navigate('/')
        // }else if(userDetail.type== 'superAdmin'){
        //     isMarketer = false
        // }else if(userDetail.type== 'marketer'){
        //     isMarketer = true
        // }
    })

    function logouthandle(){
        localStorage.removeItem('admin_details')
        navigate('/')
    }

</script>

<main>
    <NavBar/>
    <div class="bg-white row container justify-content-center m-auto">
        {#if isMarketer == true}
        <Router basepath='marketer/' primary={false}>
            <!-- -------Sidebar----- -->
            <div id="sidebar" class="shadow col-sm-3">
                <nav class="border-bottom navbar-expand-lg">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#sideBarToggle" aria-controls="sideBarToggle" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="flex-column nav-sidebar" id="sideBarToggle" activeKey={window.location.pathname}>
                        <div class="m-3"></div>
                        <div class="pill"><Link to=" " class='nav-link active'><i class="fa fa-desktop fa-lg text-info m-2"></i>Home</Link></div>

                        <a class='head' href="#sub-menu" data-toggle="collapse">Orders<span class="fa fa-caret-right ml-2"></span></a>
                        <div class="collapse " id="sub-menu">
                            <div class="pill"><Link to="confirm" class='nav-link'><i class="fa fa-check-square-o fa-lg text-success m-2"></i>Confirmed</Link></div>
                            <div class="pill"><Link to="first" class='nav-link'><i class="fa fa-money fa-lg text-warning m-2"></i>First Pay</Link></div>
                            <div class="pill"><Link to="printing" class='nav-link'><i class="fa fa-print fa-lg text-primary m-2"></i>Printing</Link></div>
                            <div class="pill"><Link to="second" class='nav-link'><i class="fa fa-money fa-lg text-success m-2"></i>Second Pay</Link></div>
                            <div class="pill"><Link to="completed" class='nav-link'><i class="fa fa-list fa-lg text-info m-2"></i>Completed</Link></div>
                        </div>

                        <p disabled class='head'>Products</p>
                        <div class="pill"><Link to="product" class='nav-link'><i class="fa fa-list fa-lg text-secondary m-2"></i>View</Link></div>
                        <div class="pill"><Link to="search_product" class='nav-link'><i class="fa fa-search fa-lg text-primary m-2"></i>Search</Link></div>

                        <p disabled class='head'>Distributers</p>
                        <div class="pill"><Link to="user_list" class='nav-link'><i class="fa fa-list fa-lg text-info m-2"></i>View</Link></div>

                        <p disabled class='head'></p>
                        <div class="pill"><Link to="profile" class='nav-link'><i class="fa fa-cogs fa-lg text-warning m-2"></i>Settings</Link></div>
                        <!-- <button class='btn' ><i class="fa fa-cogs fa-lg text-success m-2"></i> Account</button> -->
                        <button class='btn' on:click={logouthandle}><i class="fa fa-sign-out fa-lg text-danger m-2"></i> Logout</button>
                    </div>
                </nav>
            </div>
            <!-- -------Content----- -->
            <div class="tab-content p-2 col col-offset-sm-3">
                <Route path="/" component={Home}/>
                <Route path="/confirm" component={Confirm}/>
                <Route path="/first" component={First}/>
                <Route path="/printing" component={Print}/>
                <Route path="/second" component={Second}/>
                <Route path="/completed" component={Completed}/>
                <Route path="/product" component={ProductView}/>
                <Route path="/search_product" component={ProductSearch}/>
                <Route path="/user_list" component={UserList}/>
                <Route path="/user_list/:id" component={UserView}/>
                <Route path="/profile" component={Profile}/>
            </div>
        </Router>
        {/if}
    </div>
</main>

<style>

.tab-content {
    /* flex: 1; */
    width: calc(100%-250px);
    margin-left: 20px;

}
#sidebar{
    min-width: 250px;
    height: 100vh;
}
.nav-sidebar{
    width: 100% !important;
}

.nav-sidebar .pill{
    font-weight: 400;
    color: #353333 !important;
}
.nav-sidebar .pill:hover, .pill:active{
    font-weight: bold;
    color: black;
    background-color: #dafaf8;
    border-radius: 30px;
}

.head{
    color: #524f4f !important;
    font-size: 20px;
    margin-top: 20px;
    border-bottom: 1px solid gray;
    text-decoration: none;
}
.head span{
    color: #00a6cf;
    transition: transform 0.3s ease;
    transform: translateX(0px);
}
.head:hover span{
    color: #03708b;
    transform: translateX(10px);
}

.btn:hover{
    font-weight: bold;
    border-radius: 30px;
}
.btn{
    float: left;
    text-align: left;
}

.pill:hover i, .btn:hover i{
    animation: bellshake .5s cubic-bezier(.36,.07,.19,.97) both;
    backface-visibility: hidden;
    transform-origin: top right;
}

@keyframes bellshake {
  0% { transform: rotate(0); }
  15% { transform: rotate(7deg); }
  30% { transform: rotate(-7deg); }
  45% { transform: rotate(5deg); }
  60% { transform: rotate(-5deg); }
  75% { transform: rotate(3deg); }
  85% { transform: rotate(-3deg); }
  92% { transform: rotate(1deg); }
  100% { transform: rotate(0); }
}

</style>