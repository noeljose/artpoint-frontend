<script>
    import {API_URL} from '../../../component/constant'
    import { onMount } from 'svelte';
    
    let categories=[]
    let products=[]
    let sCate=[]
    let selectedCate;
    let inputs ={
        title:"",
    }
    let message={msg:"",style:""}
    
    onMount(async () => {
        // fetchCategory()
    })
    
    const fetchCategory =async()=>{
        await fetch(`${API_URL}/products/category/list`,{method:'POST'})
        .then((response) => response.json())
        .then((datas) => {
            categories = datas.data;
        })
    }
    const cateChange=(e)=>{
        selectedCate = e.target.value
        if(selectedCate == ""|| selectedCate=="undefined"){
            sCate=[]
        }else{
            let cate = categories.find(tmp=>tmp.category===selectedCate)
            sCate = cate.subCategory
        }
    }
        
    const search =async()=>{
        if(inputs.title != ''){
            message.msg= ''
            await fetch(`${API_URL}/products/search`,{
                method:'POST',
                body:JSON.stringify(inputs),
                headers:{'Content-Type': 'application/json'}
            })
            .then((response) => response.json())
            .then((datas) => {
                products = datas.data;
            })
        }else{
            message.style ='text-danger'
            message.msg= 'Enter Product Name'
            const val = document.getElementById('searchIn')
            val.focus()
        }
    }
    
    </script>
    <main>
        <div class="container border">
            <h4 class="heading text-center p-2 ">Product Search</h4>
            <div class="border-top">
                <div class="row m-auto pt-2">
                    <div class="col">
                        <input type="text" class="form-control form-input" placeholder="Product Name" bind:value={inputs.title} id="searchIn"/>
                    </div>
                    <div class="col-sm-3">
                        <button class='btn btn-create' on:click={search}>Search</button>
                    </div>
                </div>
                <!-- <div class="row m-auto pt-2">
                    <div class="col">
                        <select class="form-control form-select" on:change={(e)=>cateChange(e)} bind:value={inputs.category}>
                            <option value="">Category.. </option>
                            {#each categories as item}
                                <option key={item._id} value={item.category}>{item.category}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="col">
                        <select class="form-control form-select" bind:value={inputs.subCategory}>
                            <option value="">Sub Category.. </option>
                            {#each sCate as item}
                                <option value={item}>{item}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="col-sm-3">
                        <button class='btn btn-create' on:click={search}>Search</button>
                    </div>
                </div> -->
                <div class="container row m-auto justify-content-center">
                    <p class='{message.style}'><b>{message.msg}</b></p>
                </div>
                {#if products !== ""}
                    <div class="row justify-content-center">
                        {#each products as datas}
                        <div class="card rounded-lg col-sm-10">
                            <a href="/admin/produt_view/{datas._id}">
                            <div class="row p-2">
                                <div class="col ">
                                    <img src={`${API_URL}/products/images/${datas.image}`} alt="images"/>
                                </div>
                                <div class="col">
                                    <h5 class="m-2 ">Product: {datas.title}</h5>
                                    <p class="m-2 ">Category: <b>{datas.category}</b></p>
                                    <p class="m-2 ">Sub-Category: <b>{datas.subCategory}</b></p>
                                </div>
                            </div>
                            </a>
                        </div>
                        {/each}  
                    </div>
                {/if}
                {#if products == ""}
                    <div class="row justify-content-center">
                        <h5 class="text-secondary p-4 m-4 ">No Products..</h5>
                    </div>
                {/if}
            </div>
        </div>
    </main>
    
    <style>
    .heading{
        color:#0b6e9c;
    }
    .card{
        margin: 10px;
        padding: 5px;  
    }
    .card:hover{
        border-top: 2px solid #0DB8DE;
    border-right: 2px solid #0DB8DE;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
    }
    .card a{
        text-decoration: none !important;
    }
    .card img{
        width: 150px;
        height: auto;
        border-radius: 8px;
    }
    .form-input{
    width: 100%;
    background: rgb(245, 252, 255);
    color: #012630;
    border: 1px solid #0DB8DE;
    font-size: 1em;
    font-weight: 600;
    padding: 10px;
    margin: 2px;
    text-transform: capitalize;
}
    .form-select{
        border: 1px solid #0DB8DE;
        width: 100%;
        color: #012630;
        font-size: 1em;
        font-weight: 600;
        margin: 2px;
        background: rgb(245, 252, 255);
    }
    .btn-create{
        width: 100%;
        margin: 2px;
        color: #047b96;
        font-weight: 600;
        padding: 4px 25px;
        border: 2px solid #0DB8DE;
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
    }
    .btn-create:hover{
        color: #01181d;
        background: #0DB8DE;
        border: 2px solid #0DB8DE;
        box-shadow: 0 8px 8px rgba(0, 0, 0, 0.2);
    }
    </style>