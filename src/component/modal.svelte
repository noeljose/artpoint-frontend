<script>
    import { createEventDispatcher } from 'svelte';	
    const dispatch = createEventDispatcher();
	
    export let openModal;
	export let name;
    export let image;
    export let cost;
    export let material;
    export let type;
    export let quantity;

    function closeModal() {
        openModal = false;
        dispatch('closeModal', { openModal });
    }

    
</script>

<div id="background" style="--display: {openModal ? 'block' : 'none'};" on:click={closeModal}></div>
<div id="modal" style="--display: {openModal ? 'block' : 'none'};">
    <div class="card card-user">
        <div class="card-info text-center row">
            <div class="col">
                <img src="{image}" alt="pic"/>
            </div>
            <div class="col">
                <h4>{name}</h4>
                <h6>{material} - {type}</h6> 
                <p><b>{cost}</b></p>
                <p>Stocks: {quantity}</p>
            </div>
        </div>
    </div>
</div>

<style>
    #background {
        display: var(--display);
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    #modal {
        display: var(--display);
       	position: fixed;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: transparent;
    }
    .card-user {
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 5px 5px rgba(161, 161, 161, 0.2);
	max-width: 100%;
	margin: 10px;
	width: 500px;
}
.card-info {
	padding: 20px;
	width: 100%;
    padding-bottom: 15px;
    color: #011d24;
}
.card-info img{
    height: 300px;
    width: 200px;
}

</style>