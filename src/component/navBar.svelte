<script>
  import {navigate} from "svelte-navigator";

  function logouthandle(){
    localStorage.removeItem('admin_details')
    navigate('/')
  }
</script>
<main class='body'>
    <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="/"><img alt='logo' src="/assert/artLogo.PNG"/></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
            <li class="nav dropdown ml-auto">
              <div class="btn nav-item dropdown-toggle" type="button" id="dropdownMenuButton" 
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Profile</div>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="/marketer/"><i class="fa fa-arrow-right m-2 text-info"></i>Orders</a>
                  <a class="dropdown-item" href="/marketer/confirm"><i class="fa fa-arrow-right m-2 text-info"></i>Confirmed</a>
                  <a class="dropdown-item" href="/marketer/completed"><i class="fa fa-arrow-right m-2 text-info"></i>Completed</a>
                  <a class="dropdown-item" href="/marketer/search_product"><i class="fa fa-search m-2 text-info"></i>Products</a>
                  <div class="dropdown-divider text-primary"></div>
                  <a class="dropdown-item" href="/marketer/profile"><i class="fa fa-cogs m-2 text-info"></i>Settings</a>
                </div>
            </li>
            <li class='nav nav-item ml-4'>
                <button class="nav-link btn" on:click={logouthandle}><i class="text-danger fa fa-sign-out fa-lg"></i></button>
            </li>
        </div>
      </nav>
</main>

<style>
  .body{
    background-color: rgba(0, 255, 255, 0.377);
  }
.navbar {
    position: relative;
    background: #d1cfcf4d!important;
}
.navbar-brand img {
    color: #000000;
    font-size: 30px;
    text-transform: uppercase;
    width: 180px;
    height: auto;
}

.navbar-brand:hover {
    color: #1a1a1a;
    font-weight: bold;
    transition: .02s ease-in-out;
}
.nav-link,.dropdown-item{
    color: #1a1a1a;
  }

.nav-item{
    color: #1a1a1a;
}
.dropdown-toggle{
  pointer-events: none;
  font-weight: bold;
}

 .nav-link:hover, 
 .dropdown-item:hover{
    font-weight: bold;
  }

  .dropdown:hover>.dropdown-menu {
  display: block;
}

  @media (min-width: 992px) {
    .navbar {
        position: relative;
        width: 100%;
        background:#ffffffee!important;
    }
}
@media (max-width: 991.98px) {   
    .navbar {
      position: relative;
      overflow: hidden;
      background: #ffffffee!important;
    }
}
</style>