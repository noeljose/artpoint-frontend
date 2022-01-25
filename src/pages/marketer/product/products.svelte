<script>
import {API_URL} from '../../../component/constant'
import { onMount } from 'svelte';
import Swal from "sweetalert2";

let categories=[]
let products=[]
let sCate=[]
let selectedCate;
let inputs ={
    skip:"",
    limit:"",
    category:"",
    subCategory:""
}

onMount(async () => {
    fetchCategory()
    // fetchProduct()
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

const fetchProduct =async()=>{
    await fetch(`${API_URL}/products/list`,{
        method:'POST',
        body:JSON.stringify(inputs),
        headers:{'Content-Type': 'application/json'}
    })
    .then((response) => response.json())
    .then((datas) => {
        products = datas.data;
    })
}

const search =async()=>{
    fetchProduct()
}

const viewItem=(e)=>{
    Swal.fire({
      title: e.title,
      text: e.category +' '+e.subCategory,
      imageUrl: `${API_URL}/products/images/${e.image}`,
      imageWidth: 100,
      imageHeight: 200,
      imageAlt: 'Custom image',
      showConfirmButton: false,
    })
   }

</script>
<main>
    <div class="container border">
        <h4 class="heading text-center p-2 ">Product Listing</h4>
        <div class="border-top">
            <div class="row justify-content-center m-auto">
                <div class="col-sm-4">
                    <select class="form-control form-select" on:change={(e)=>cateChange(e)} bind:value={inputs.category}>
                        <option value="">Category.. </option>
                        {#each categories as item}
                            <option key={item._id} value={item.category}>{item.category}</option>
                        {/each}
                    </select>
                </div>
                <div class="col-sm-4">
                    <select class="form-control form-select" bind:value={inputs.subCategory}>
                        <option value="">Sub Category.. </option>
                        {#each sCate as item}
                            <option value={item}>{item}</option>
                        {/each}
                    </select>
                </div>
                <div class="col-sm-2">
                    <button class='btn btn-create' on:click={search}>Search</button>
                </div>
            </div>
            {#if products !== ""}
                <div class="row justify-content-center">
                    {#each products as datas}
                    <div class="card rounded-lg col-sm-5" on:click={viewItem(datas)}>
                        <div class="row p-3">
                            <div class="col">
                                <img src={`${API_URL}/products/images/${datas.image}`} alt="images"/>
                            </div>
                            <div class="col">
                                <h5 class="m-2 ">{datas.title}</h5>
                                <p class="m-2 ">{datas.category}</p>
                                <p class="m-2 "><i>{datas.subCategory}</i></p>
                            </div>
                        </div>
                    </div>
                    {/each}  
                </div>
            {/if}
            {#if products == ""}
                <div class="row justify-content-center">
                    <h5 class="text-secondary p-2 ">Select Category to list Products..</h5>
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
    cursor: pointer;
}

.card:hover{
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}

.card img{
    width: 100px;
    height: auto;
    border-radius: 8px;
}
.form-select{
    border: 1px solid #0DB8DE;
    width: 100%;
    color: #012630;
    font-size: 1em;
    font-weight: 600;
    margin: 10px;
    background: rgb(245, 252, 255);
}
.btn-create{
    margin: 10px;
    justify-content: end;
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