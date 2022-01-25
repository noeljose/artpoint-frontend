<script>
    import { onMount } from 'svelte';
    import { Router, Route,Link,navigate} from "svelte-navigator";
    import NavBar from '../../component/adminNav.svelte'
	
    import Product from './product/productAdd.svelte'
    import ProductList from './product/products.svelte'
    import ProductView from './product/productView.svelte'
    import Category from './product/category.svelte'
    import Client from './marketer/clientCreate.svelte'
    import Clients from './marketer/clients.svelte'
    import ClientView from './marketer/clientView.svelte'
    import OrderList from './order/orderLander.svelte'
    import NewOrders from './order/newOrders.svelte';
    import Completed from './order/tabs/confirmed.svelte'
    import ProdSearch from './product/search.svelte'
    import OrderView from './order/tabs/orderView.svelte'
    import User from './user/userCreate.svelte'
    import Users from './user/users.svelte'
    import UserView from './user/userView.svelte'


    let isSuper = false;
    const userDetail = JSON.parse(localStorage.getItem('admin_details'))

    onMount(() => {
        if(userDetail == null || userDetail == 'null'){
            navigate('/')
        }else if(userDetail.type== 'superAdmin'){
            isSuper = true
        }else if(userDetail.type== 'marketer'){
            isSuper = false
        }
    })

    function logouthandle(){
        localStorage.removeItem('admin_details')
        navigate('/')
    }

</script>

<main>
    <NavBar/>
        <div class="row container-flex justify-content-center m-auto">
            {#if isSuper == true}
            <Router basepath='admin/' primary={false}>
            <div>
                <!-- -------Sidebar----- -->
                <div id="sidebar" class="shadow col-sm-3">
                    <div expand="lg" class="border-bottom ">
                            <div id="navbarToggler"> 
                                <nav class="m-auto flex-column nav nav-sidebar" role="tablist" activeKey={window.location.pathname}>
                                    <div class="m-3"></div>
                                    <p disabled class='head'>Manage Orders</p>
                                    <div class="pill"><Link to=" " class='nav-link active'><i class="fa fa-desktop fa-lg text-primary m-2"></i>New Orders</Link></div>
                                    <div class="pill"><Link to="orders" class='nav-link'><i class="fa fa-tasks fa-lg text-success m-2"></i>Progress</Link></div>
                                    <div class="pill"><Link to="completed" class='nav-link'><i class="fa fa-list fa-lg text-secondary m-2"></i>Completed</Link></div>
            
                                    <a class='head' href="#sub-menu" data-toggle="collapse">Product <span class="fa fa-caret-right ml-2"></span></a>
                                    <div class="collapse " id="sub-menu">
                                        <div class="pill"><Link to="category" class='nav-link'><i class="fa fa-puzzle-piece fa-lg text-info m-2"></i>Category</Link></div>
                                        <div class="pill"><Link to="product" class='nav-link'><i class="fa fa-plus fa-lg text-success m-2"></i>Product</Link></div>
                                        <div class="pill"><Link to="produt_view" class='nav-link'><i class="fa fa-cog fa-lg text-secondary m-2"></i>View All</Link></div>
                                        <div class="pill"><Link to="produt_search" class='nav-link'><i class="fa fa-search fa-lg text-primary m-2"></i>Search</Link></div>
                                    </div>
            
                                    <a class='head' href="#sub-menu2" data-toggle="collapse">Marketer<span class="fa fa-caret-right ml-2"></span></a>
                                    <div class="collapse " id="sub-menu2">
                                        <div class="pill"><Link to="client" class='nav-link'><i class="fa fa-user-plus fa-lg text-success m-2"></i>Create</Link></div>
                                        <div class="pill"><Link to="client_view" class='nav-link'><i class="fa fa-users fa-lg text-primary m-2"></i>View All</Link></div>
                                    </div>

                                    <a class='head' href="#sub-menu3" data-toggle="collapse">Distributor<span class="fa fa-caret-right ml-2"></span></a>
                                    <div class="collapse " id="sub-menu3">
                                        <div class="pill"><Link to="user" class='nav-link'><i class="fa fa-user-plus fa-lg text-success m-2"></i>Create</Link></div>
                                        <div class="pill"><Link to="user_view" class='nav-link'><i class="fa fa-users fa-lg text-primary m-2"></i>View All</Link></div>
                                    </div>
            
                                    <p disabled class=''></p>
                                    <!-- <div class="pill"><Link to="profile" class='nav-link'><i class="fa fa-cogs fa-lg text-warning m-2"></i>Settings</Link></div> -->
                                    <button class='btn' on:click={logouthandle}><i class="fa fa-sign-out fa-lg text-danger"></i> Logout</button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- -------Content----- -->
                <div class="tab-content p-2 col col-offset-sm-3">
                 <div>
                    <Route path="/" component={NewOrders}/>
                    <Route path="/completed" component={Completed}/>
                    <Route path="/orders" component={OrderList}/>
                    <Route path="/orders/:id" component={OrderView}/>
                    <Route path="/category" component={Category}/>
                    <Route path="/product" component={Product}/>
                    <Route path="/produt_view" component={ProductList}/>
                    <Route path="/produt_view/:id" component={ProductView}/>
                    <Route path="/produt_search" component={ProdSearch}/>
                    <Route path="/client" component={Client}/>
                    <Route path="/client_view" component={Clients}/>
                    <Route path="/client_view/:id" component={ClientView}/>
                    <Route path="/user" component={User}/>
                    <Route path="/user_view" component={Users}/>
                    <Route path="/user_view/:id" component={UserView}/>
                </div> 
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
.shadow{
    background-color: rgba(253, 253, 253, 0.966);
}


.nav-sidebar .pill{
    font-weight: 400;
    color: #353333 !important;
}
.nav-sidebar .pill:hover, .pill:active{
    font-weight: bold;
    color: black;
    background-color: #f0fffe;
    border-radius: 20px;
}


.head{
    color: #524f4f !important;
    font-size: 20px;
    margin-top: 20px;
    text-align: left;
    text-decoration: none;
    border-bottom: 1px solid gray;
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
    text-align: start;
}

.pill:hover i{
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