<script>
import {API_URL} from '../../../component/constant'
import {marketerValid} from '../../../component/validating'

let message={msg:"",style:""}
let inputs ={
    name:"",
    phone:"",
    email:"",
    password:"",
    active:'false'
}

const addMarketer =async()=>{
    let validate = marketerValid(inputs)
    if(validate.valid == true){
        message.style ='text-info'
        message.msg = validate.error
        try {
            message.msg="Loading.."
            const res = await fetch(`${API_URL}/admin/marketeer/create`,
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
    <div class="pt-4 "></div>
    <div class="container  border">
        <h4 class="heading text-center p-2 ">Create Marketer</h4>
        <form class="border-top">
            <div class="row">
                <div class="col-sm-3"><p>Name</p></div>
                <div class="col">
                    <input type="text" class="form-control form-input" placeholder="Name" bind:value={inputs.name}/>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-3"><p>E-mail</p></div>
                <div class="col">
                    <input required type="email" class="form-control form-input text-lower" placeholder="E-mail" bind:value={inputs.email}/>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-3"><p>Phone</p></div>
                <div class="col">
                    <input type="text" class="form-control form-input" placeholder="Phone Number" bind:value={inputs.phone}/>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-3"><p>Password</p></div>
                <div class="col">
                    <input type="password" class="form-control form-input" placeholder="Password" bind:value={inputs.password}/>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-3"><p>Status</p></div>
                <div class="col">
                    <select class="form-control form-select" bind:value={inputs.active}>
                            <option value='true'>True</option>
                            <option value='false'>False</option>
                    </select>
                </div>
            </div>
            <div class="row m-auto justify-content-center p-1">
                <p class='{message.style}'><b>{message.msg}</b></p>
            </div>
            <div class="row m-auto justify-content-end">
                <button type="button" class='btn btn-create' on:click={addMarketer}>Create</button>
            </div>
        </form>
    </div>
</main>

<style>

.heading{
    color:#0b6e9c;
}

.form-input{
    width: 80%;
    background: rgb(245, 252, 255);
    color: #012630;
    border: 1px solid #0DB8DE;
    font-size: 1em;
    font-weight: 600;
    padding: 10px;
    margin: 10px;
}
p{
    padding: 10px;
    margin: 5px; 
    font-weight: 600;
    color: #012630; 
}
.form-select{
    border: 1px solid #0DB8DE;
    width: 50%;
    color: #012630;
    font-size: 1em;
    font-weight: 600;
    margin: 10px;
    background: rgb(245, 252, 255);
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