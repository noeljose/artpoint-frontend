<script>
import {API_URL} from '../../../component/constant'
import { onMount } from 'svelte';

let marketers=[]
let inputs ={
    skip:'',
    limit:10,
}
let totalCount;

onMount(async () => {
    fetchMarketer()
})

const fetchMarketer =async()=>{
    await fetch(`${API_URL}/admin/marketeer/read`,{
        method:'POST',
        body:JSON.stringify(inputs),
        headers:{'Content-Type': 'application/json'}
    })
    .then((response) => response.json())
    .then((datas) => {
        marketers = datas.data.marketeers;
        totalCount = datas.data.count;
    })
}

</script>

<main>
<div class="container pt-4">
    <div class="border">
        <h4 class="heading text-center p-2 border-bottom">Marketers List</h4>
        {#if marketers !== ""}
        <div class="row justify-content-center">
            {#each marketers as user}
                <a class="col-sm-3 card card-user" href="/admin/client_view/{user._id}">
                    <div class="card-info">
                        <h4>{user.name}</h4>
                        <h6>Phone: <b>{user.phone}</b></h6>
                        <h6>Status: <b>{user.active}</b></h6>
                        <!-- <p><b>{user.orders.length}</b> Orders</p> -->
                    </div>
                </a>
            {/each}
        </div>
        {/if}
        {#if marketers == ""}
            <div class="row justify-content-center">
                <h5 class="text-secondary p-2 ">No Marketers..</h5>
            </div>
        {/if}
    </div>
</div>
</main>

<style>
    .heading{
    color:#0b6e9c;
}
.card-user {
	background-color: #fff;
	border-radius: 10px;
    color: #03728b;
	display: flex;
	max-width: 100%;
	margin: 10px;
	overflow: hidden;
	width: 700px;
    text-align: center;
    text-decoration: none;
}
.card-user:hover{
    border-top: 2px solid #0DB8DE;
    border-right: 2px solid #0DB8DE;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}
.card-info {
	padding: 10px;
	width: 100%;
    padding-bottom: 15px;
}
.card-info h4{
	color: #02404e;
    text-transform: uppercase;
}
.card-info h6{
    text-transform: capitalize;
}
/* .card-btn {
	border: 2px solid #0DB8DE;
	border-radius: 10px;
	color: #0DB8DE;
	padding: 5px 20px;
} */
</style>