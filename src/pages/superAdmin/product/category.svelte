<script>
    import { onMount } from 'svelte';
    import {API_URL} from '../../../component/constant'

    let categories=[]
    let newCategories = {category:"",subCategory:""}
    let sCate=[]
    let newSubCate=[]
    let newSubChange;
    let newCate = 'null';
    let message="";
    let message2="";

    let catId;
    let cateChange;
    let addSChange;
    let selCat

    onMount(async () => {
        await fetch(`${API_URL}/products/category/list`,{method:'POST'})
        .then((response) => response.json())
        .then((datas) => {
            categories = datas.data;
        })
    })

    const changeCate =(e)=>{
        selCat = e.target.value
        try {
            let cate = categories.find(tmp=>tmp.category===selCat)
            catId = cate._id
            if(cate == undefined || cate == 'undefined'){
                cateChange = selCat
            }else{
                sCate = cate.subCategory
            }            
        } catch (error) {
        }
    }

 // ---Add new categories----
    const changeNewCat=(e)=>{
        newCate = e.target.value
    }
    const changeNewScat=(e)=>{
        newSubChange = e.target.value
    }
    const newSubcat=()=>{
        newSubCate = [...newSubCate , newSubChange]
    }

    const addNewCate = async()=>{
        if(newCate === "null"){
            message="** Category Field Empty"
        } else{
            newCategories={category:newCate,subCategory:newSubCate}
            try {
                message="Loading.."
                const res = await fetch(`${API_URL}/products/category/create`,
                { method:'post',
                body:JSON.stringify(newCategories),
                headers:{'Content-Type': 'application/json'}
                })
                const json = await res.json()
                message=json.message
                if(json.status === true){
                    window.location.reload()
                }
            } catch (error) {
                message="Network Error"
            }
        }
    }

// ---Update categories----
    const addNewScat =(e)=>{
        addSChange = e.target.value
    }

    const addSubCat = ()=>{
      sCate =[...sCate,addSChange]
    }

    const sCatChange =(e,i)=>{
        const item = sCate
        item.splice(i,1,e.target.value)
        sCate = item
    }

    const updateCate =async ()=>{
        newCategories={_id:catId,category:selCat,subCategory:sCate}
        try {
            message2="Loading..."
            const res = await fetch(`${API_URL}/products/category/update`,
            { method:'post',
              body:JSON.stringify(newCategories),
              headers:{'Content-Type': 'application/json'}
            })
            const json = await res.json()
            message2=json.message
            if(json.status === true){
                window.location.reload()
            }              
        } catch (error) {
            message2="Network Error"
        }
    }

    const deleteSCat=(i,e)=>{
        const item = sCate
        item.splice(i, 1);
        sCate=item
        console.log(item)
    }

    const deleteCate =async ()=>{
        newCategories={_id:catId,category:selCat,subCategory:sCate}
        try {
            message2="Loading..."
            const res = await fetch(`${API_URL}/products/category/delete`,
            { method:'post',
              body:JSON.stringify(newCategories),
              headers:{'Content-Type': 'application/json'}
            })
            const json = await res.json()
            message2="Delete Success"
            window.location.reload()
            if(json.status === true){
                window.location.reload()
            }              
        } catch (error) {
            message2="Network Error"
        }
    }

</script>

<main>
    <div class ='row justify-content-center'>
            <div class="container ml-2 p-2 border">
                <h4 class="heading text-center ">Categories</h4>
                <form class="p-3 border-top">
                    <h5 class="text-secondary">Add Categories</h5>
                    <div class="row">
                        <div class="col">
                            <input class="form-control form-input" placeholder="Category" on:change={(e)=>changeNewCat(e)}/>
                        </div>
                        <div class="col">
                            <div class="row input-group">
                                <input class="form-control form-input" placeholder="Sub Category" on:change={(e)=>changeNewScat(e)}/>
                                <div class="input-group-append">
                                    <button type="button" class='btn btn-info mt-2' on:click={newSubcat}><i class="fa fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="row">
                                {#if newSubCate}
                                    {#each newSubCate as cate}
                                        <input class="form-control form-input" placeholder="Sub Category" value={cate}/>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="row m-auto justify-content-center">
                        <button type="button" class='btn btn-create' on:click={addNewCate}>Save Category</button>
                    </div>
                    <div class="row m-auto justify-content-center">
                        <p class="text-primary"><b>{message}</b></p>
                    </div>

                    <div class="row m-2 p-2"></div>

                    <div>
                        <h5 class="text-secondary">Manage Categories</h5>
                        <div class="row border-top pt-2">
                            <div class="col">
                                <input class="form-control form-select" placeholder="Category" list="cate" on:change={(e)=>changeCate(e)}/>
                                <datalist id="cate">
                                    {#each categories as item}
                                    <option key={item._id} value={item.category}>{item.category}</option>
                                    {/each}
                                </datalist>
                            </div>
                            <div class="col">
                                    {#if sCate}
                                        {#each sCate as cate,i}
                                        <div class="row input-group">
                                            <input class="form-control form-input" placeholder="Sub Category" value={cate} on:change={(e)=>sCatChange(e,i)}/>
                                            <div class="input-group-append">
                                                <button type="button" class='btn btn-danger mt-2' value={i} on:click={(e)=>deleteSCat(i,e)}><i class="fa fa-minus"></i></button>
                                            </div> 
                                        </div>
                                        {/each}
                                    {/if}
                                <div class="row input-group">
                                    <input class="form-control form-input" placeholder="Sub Category" on:change={(e)=>addNewScat(e)}/>
                                    <div class="input-group-append">
                                        <button type="button" class='btn btn-info mt-2' on:click={addSubCat}><i class="fa fa-plus"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-end mt-3">
                            <button type="button" class='btn btn-outline-success m-2' on:click={updateCate}>Update</button>
                            <button type="button" class='btn btn-outline-danger m-2' on:click={deleteCate}>Delete</button>
                            <a href="/admin/produt_view" class='btn btn-outline-secondary m-2'>Back</a>
                        </div>
                        <div class="row m-auto justify-content-center">
                            <p class="text-primary"><b>{message2}</b></p>
                        </div>
                    </div>
                </form>
            </div>
    </div>
</main>

<style>
    .heading{
        color:#0b6e9c;
    }

    .form-input{
        width: 100%;
        background: #ffff;
        color: #012630;
        border: 1px solid #0DB8DE;
        font-size: 1em;
        font-weight: 600;
        padding: 20px;
        margin:5px;
    }
    .form-select{
        width: 100%;
        border: 1px solid #0DB8DE;
        font-weight: 600;
        padding: 20px;
        overflow: hidden;
        margin:5px;
        text-transform: capitalize;
    }

    .btn-create{
        margin: 10px;
        justify-content: end;
        color: #047088;
        font-weight: 500;
        padding: 8px 25px;
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