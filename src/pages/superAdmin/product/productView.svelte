<script>
    import { onMount } from 'svelte';
    import {navigate} from 'svelte-navigator'
    import Swal from "sweetalert2";

    import {API_URL} from '../../../component/constant'
    import {productValid} from '../../../component/validating'

    export let id;

    let fileinput;
    let categories=[]
    let sCate=[]
    let selectedCate;
    let message={msg:"",style:""}
    let imageShow;
    let imageData;

    let product ={
        title:"",
        category:"",
        subCategory:"",
        image:"",
        _id:""
    }

    onMount(async () => {
        await fetch(`${API_URL}/products/category/list`,{method:'POST'})
        .then((response) => response.json())
        .then((datas) => {
            categories = datas.data;
        })
        await fetch(`${API_URL}/products/list/${id}`,{method:'POST'})
        .then((response) => response.json())
        .then((datas) => {
            product = datas.data;
            let cate = categories.find(tmp=>tmp.category===datas.data.category)
            sCate = cate.subCategory
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
    formData.append('oldImage',product.image)
    try {
        const res = await fetch(`${API_URL}/products/updateimage`,{
        method: "POST",
        body: formData,
        headers: {
                'Accept': 'application/json',
            }
        })
        const json = await res.json()
        console.log(json)
        message.style ='text-primary'
        message.msg=json.message
        if(json.status === true){
            product.image=json.data
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

    const updateProduct=async()=>{
    let validate = productValid(product)
    if(validate.valid == true){
        message.style ='text-info'
        message.msg = validate.error
        try {
            const res = await fetch(`${API_URL}/products/update`,
            { method:'post',
            body:JSON.stringify(product),
            headers:{'Content-Type': 'application/json'}
            })
            const json = await res.json()
            message.style ='text-primary'
            message.msg=json.message
        } catch (error) {
            message.style ='text-warning'
            message.msg = "Network error !!"
        }
    }else{
        message.style ='text-danger'
        message.msg = validate.error
    }
    }

    const deleteProduct =async()=>{
            try {
            const res = await fetch(`${API_URL}/products/delete/${id}`,
            { method:'post',
            headers:{'Content-Type': 'application/json'}
            })
            const json = await res.json()
            if(json.status === true){
                navigate('/admin/produt_view')
            }
        } catch (error) {
            message.style ='text-warning'
            message.msg = "Network error !!"
        }        
    }

    const deleteConfirm =async()=>{
    Swal.fire({
        title: 'Are you sure?',
        text: "Delete  " + product.title ,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteProduct()
        }
    })
    }
    
    </script>
    
    <main>
        <div class ='row justify-content-center ml-2 '>
                <div class="container border p-4">
                    <h4 class="heading text-center ">Manage Product:</h4>
                    <form class="p-2 border-top">
                        <div class="">
                            <input type="text" class="form-control form-input" bind:value={product.title}/>
                            <div class="row">
                                <div class="col-sm">
                                    <select class="form-control form-select" on:change={(e)=>cateChange(e)} bind:value={product.category}>
                                        <option value="">Category.. </option>
                                        {#each categories as item}
                                            <option key={item._id} value={item.category}>{item.category}</option>
                                        {/each}
                                    </select>
                                </div>
                                <div class="col-sm">
                                    <select class="form-control form-select" bind:value={product.subCategory}>
                                        <option value="">Sub Category.. </option>
                                        {#each sCate as item}
                                            <option value={item}>{item}</option>
                                        {/each}
                                    </select>
                                </div>
                            </div>
                            <div class="row upload">
                                {#if imageShow}
                                <div class="col-sm-6">
                                    <img src="{imageShow}" alt="pic" class='img img-responsive'/>
                                </div>
                                {:else}
                                <div class="col-sm-6">
                                    <img src= {`${API_URL}/products/images/${product.image}`} alt="pic" class='img img-responsive'/>
                                </div>
                                {/if}

                                <div class="col-sm-6">
                                    <div class="btnCon row">
                                        <div class="uploadBtn " on:click={()=>{fileinput.click();}}><i class="fa fa-picture-o fa-lg"></i> Change Image</div>
                                        <input style="display:none" type="file" on:change={(e)=>imageChange(e)} bind:this={fileinput}>
                                        <button type="button" on:click={imageUpload}><i class="fa fa-upload fa-lg"></i> Upload</button>
                                    </div>
                                </div>
                            </div>
                            <div class="row m-auto justify-content-center border-bottom">
                                <p class='{message.style}'><b>{message.msg}</b></p>
                            </div>
                            <div class="row m-auto justify-content-end">
                                <button type="button" class='btns btn btn-outline-info' on:click={updateProduct}>Update</button>
                                <button type="button" class='btns btn btn-outline-danger' on:click={deleteConfirm}>Delete</button>
                                <a href="/admin/produt_view" class='btns btn btn-outline-secondary'>Back</a>
                            </div>
                    </form>
                </div>
        </div>
    </main>
    
    <style>
    
    .heading{
        color:#0b6e9c;
        text-decoration: underline;
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

    .form-select{
    border: 1px solid #0DB8DE;
    width: 100%;
    color: #012630;
    font-size: 1em;
    font-weight: 600;
    margin: 10px;
    background: rgb(245, 252, 255);
}
    
.btns{
    margin: 10px;
}
.btns:hover{
    font-weight: 600;
}
    
.upload img{
    max-width: 300px;
    width: 100%;
    height: auto;
    margin: 10px;
    border: 2px dotted rgba(49, 49, 49, 0.37)
}
.upload button{
    width: 40%;
    height: 40px;
    margin: 10px;
    color: #0DB8DE;
    font-weight: 500;
    padding: 4px 10px;
    border: 2px solid #0DB8DE;
}
.uploadBtn{
    width: auto;
    height: 40px;
    cursor:pointer;
    color: #0DB8DE;
    margin: 10px;
    border: 2px solid #0DB8DE;
    text-align: center;
    padding: 4px 10px;
}

.upload button:hover,.uploadBtn:hover{
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    border: 3px solid #0DB8DE;
    color: #04718a;
    font-weight: 600;
}
.btnCon{
    width: 100%;
    position: absolute;
    bottom: 5px;
    justify-content: center;
    align-items: center;
    margin: auto;
}
</style>