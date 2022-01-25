<script>
import {API_URL} from '../../../component/constant'
import {productValid} from '../../../component/validating'
import { onMount } from 'svelte';

let fileinput;
let categories=[]
let sCate=[]
let selectedCate;
let message={msg:"",style:""}
let inputs ={
    title:"",
    category:"",
    subCategory:"",
    image:""
}

let imageShow = null
let imageData;

onMount(async () => {
    await fetch(`${API_URL}/products/category/list`,{method:'POST'})
    .then((response) => response.json())
    .then((datas) => {
        categories = datas.data;
    })
})


const cateChange=(e)=>{
    selectedCate = e.target.value
    if(selectedCate == ""|| selectedCate=="undefined"){
        sCate=[]
    }else{
        let cate = categories.find(tmp=>tmp.category===selectedCate)
        sCate = cate.subCategory
    }
}

const imageUpload =async()=>{
    const formData = new FormData();
	formData.append("productimage", imageData);
    try {
        const res = await fetch(`${API_URL}/products/uploadimage`,{
        method: "POST",
        body: formData,
        headers: {
                'Accept': 'application/json',
            }
        })
        const json = await res.json()
        message.style ='text-info'
        message.msg=json.message
        if(json.status === true){
            inputs.image=json.data
        }
    } catch (error) {
        
    }
}

const imageChange=(event)=>{
    let image = event.target.files[0];
    imageData = image
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e => {
            imageShow = e.target.result
    };
}

const addProduct= async()=>{
    
    let validate = productValid(inputs)
    if(validate.valid == true){
        message.style ='text-info'
        message.msg = validate.error
        try {
            message.msg="Loading.."
            const res = await fetch(`${API_URL}/products/create`,
            { method:'post',
            body:JSON.stringify(inputs),
            headers:{'Content-Type': 'application/json'}
            })
            const json = await res.json()
            message.style ='text-info'
                message.msg=json.message
            if(json.status === true){
                inputs.image=""
            }
        } catch (error) {
            message.style ='text-warning'
            message.msg = "Network error !!"
        }
    }else{
        message.style ='text-danger'
        message.msg = validate.error
    }
}

</script>

<main>
    <div class ='row justify-content-center'>
            <div class="container ml-2 p-2 border">
                <h4 class="heading text-center ">Add New Product</h4>
                <form class="p-3 border-top">
                    <div class="">
                        <input type="text" class="form-control form-input" placeholder="Product Name" bind:value={inputs.title}/>
                        <!-- <div class="row">
                            <div class="col">
                                <input type="text" class="form-control form-input" placeholder="Price" bind:value={inputs.cost}/>
                            </div>
                        </div> -->
                        <div class="row">
                            <div class="col-sm">
                                <select class="form-control form-select" on:change={(e)=>cateChange(e)} bind:value={inputs.category}>
                                    <option value="">Category.. </option>
                                    {#each categories as item}
                                        <option key={item._id} value={item.category}>{item.category}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="col-sm">
                                <select class="form-control form-select" bind:value={inputs.subCategory}>
                                    <option value="">Sub Category.. </option>
                                    {#each sCate as item}
                                        <option value={item}>{item}</option>
                                    {/each}
                                </select>
                            </div>
                            <!-- <div class="col-sm">
                                <select class="form-control form-select" placeholder="Glass Type" bind:value={inputs.type}>
                                    <option value="">Type</option>
                                    <option>Type 1</option>
                                    <option>Type 2</option>
                                    <option>Type 3</option>
                                </select>
                            </div> -->
                        </div>
                     </div>
                    <div class="row upload">
                        <div class="col-sm-6">
                            <div class="p-2">
                                {#if imageShow}
                                <img src="{imageShow}" alt="pic" class='img img-responsive p-1 m-1'/>
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="row upload">
                        <div class="col-sm-6 d-flex">
                            <div class="uploadBtn" on:click={()=>{fileinput.click();}}><i class="fa fa-picture-o fa-lg"></i> Pick Image</div>
                            <input style="display:none" type="file" on:change={(e)=>imageChange(e)} bind:this={fileinput}>
                            <button type="button" on:click={imageUpload}><i class="fa fa-upload fa-lg"></i> Upload</button>
                        </div>
                    </div>
                    <div class="row m-auto justify-content-center">
                        <p class='{message.style}'><b>{message.msg}</b></p>
                    </div>
                    <div class="row m-auto justify-content-end">
                        <button type="button" class='btn btn-create' on:click={addProduct}>Add Product</button>
                    </div>
                </form>
            </div>
    </div>
</main>

<style>

.heading{
    color:#0b6e9c;
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


.form-input{
    width: 100%;
    background: rgb(245, 252, 255);
    color: #012630;
    border: 1px solid #0DB8DE;
    font-size: 1em;
    font-weight: 600;
    padding: 20px;
    margin: 10px;
    text-transform: capitalize;
}

.btn-create{
    margin: 10px;
    justify-content: end;
    color: #0DB8DE;
    font-weight: 500;
    padding: 8px 25px;
    border: 2px solid #0DB8DE;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}
.btn-create:hover{
    color: #01181d;
    background: #0DB8DE;
    font-weight: 600;
    border: 2px solid #0DB8DE;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.2);
}

.upload img{
    max-width: 300px;
    width: 100%;
    height: auto;
    border: 2px dotted rgba(49, 49, 49, 0.37)
}
.upload button{
    margin: 10px;
    width: 40%;
    height: 40px;
    color: #0DB8DE;
    font-weight: 500;
    border: 2px solid #0DB8DE;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}
.uploadBtn{
    width: 50%;
    height: 40px;
    cursor:pointer;
    margin: 10px;
    border: 2px solid #0DB8DE;
    text-align: center;
    padding: 4px 10px;
    color: #0DB8DE;
}
.upload button:hover,.uploadBtn:hover{
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    border: 3px solid #0DB8DE;
    color: #04718a;
    font-weight: 600;
}

</style>