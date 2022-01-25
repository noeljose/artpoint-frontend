<script>
import {API_URL} from '../../../component/constant'
import {distributerValid} from '../../../component/validating'

let message={msg:"",style:""}
let inputs ={
    name : '',
    phone : '',
    email : '',
    password : '',
    basePrice : '',
    deliveryPrice : '',
    address:''
}

const addDistributer=async()=>{
    let validate = distributerValid(inputs)
    if(validate.valid == true){
        message.style ='text-info'
        message.msg = validate.error
        try {
            message.msg="Loading.."
            const res = await fetch(`${API_URL}/admin/distributer/create`,
            { method:'post',
            body:JSON.stringify(inputs),
            headers:{'Content-Type': 'application/json'}
            })
            const json = await res.json()
            console.log(json)
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
            <div class="container mt-2 border">
                <h4 class="heading text-center p-2">Create Distributer</h4>
                <form class="border-top col-md-10 m-auto">
                    <input type="text" class="form-control form-input" placeholder="Name" bind:value={inputs.name}/>
                    <input type="text" class="form-control form-input" placeholder="Mobile Number" maxlength="10" bind:value={inputs.phone}/>
                    <input type="email" class="form-control form-input text-lower" placeholder="E-mail" bind:value={inputs.email}/>
                    <input type="password" class="form-control form-input" placeholder="Password" bind:value={inputs.password}/>    
                    <input type="text" class="form-control form-input" placeholder="Base Price" bind:value={inputs.basePrice}/>
                    <input type="text" class="form-control form-input" placeholder="Delivery Price" bind:value={inputs.deliveryPrice}/>             
                    <textarea type="text" class="form-control form-input" placeholder="Address" row=3 bind:value={inputs.address}/>
                    <div class="row m-auto justify-content-center p-1">
                        <p class='{message.style}'><b>{message.msg}</b></p>
                    </div>
                    <div class="row m-auto justify-content-end">
                        <button type="button" class='btn btn-create' on:click={addDistributer}>Create</button>
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
    background: rgb(245, 252, 255);
    color: #012630;
    border: 1px solid #0DB8DE;
    font-size: 1em;
    font-weight: 600;
    padding: 20px;
    margin: 10px;
}

.btn-create{
    margin: 10px;
    justify-content: end;
    align-items: flex-end;
    color: #0DB8DE;
    font-weight: 500;
    padding: 5px 25px;
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