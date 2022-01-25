<script>
  import { onMount } from 'svelte';
  import {navigate} from 'svelte-navigator'
  import Swal from "sweetalert2";

  import {API_URL} from '../../../component/constant'
  import {distributerValid} from '../../../component/validating'

  export let id;

  let message={msg:"",style:""}
  let inputs ={
    name : '',
    phone : '',
    email : '',
    password : '',
    basePrice : '',
    deliveryPrice : '',
    address:'',
    active:false
}
let myJobs =[]

onMount(async () => {
  await fetch(`${API_URL}/admin/distributer/read/${id}`,{method:'POST'})
    .then((response) => response.json())
    .then((datas) => {
      inputs = datas.data;
    })

  let bodyData={_id:id}
  const res = await fetch(`${API_URL}/distributer/my_orders`,
    { method:'post',
    body:JSON.stringify(bodyData),
    headers:{'Content-Type': 'application/json'}
    })
    const json = await res.json()
    myJobs=json.data
})

const updateHandle =async()=>{
    let validate = distributerValid(inputs)
    if(validate.valid == true){
        message.style ='text-info'
        message.msg = validate.error
        try {
            message.msg="Loading.."
            const res = await fetch(`${API_URL}/admin/distributer/update`,
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

const deleteConfirm =async()=>{
  Swal.fire({
    title: 'Are you sure?',
    text: "Delete  " + inputs.name ,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteHandle()
    }
  })
}

const deleteHandle=async()=>{
  try {
   let bodyIn = {_id:id}
      const res = await fetch(`${API_URL}/admin/distributer/delete`,
        { method:'post',
        body:JSON.stringify(bodyIn),
        headers:{'Content-Type': 'application/json'}
      })
      const json = await res.json()
      if(json.status === true){
          navigate('/admin/user_view')
      }
      } catch (error) {
          message.style ='text-warning'
          message.msg = "Network error !!"
        }
}

const chekboxx=(e)=>{
  const checked = e.target.checked
  inputs.active = checked
}

  const viewItem = async (e) => {
    await fetch(`${API_URL}/products/list/${e}`, { method: "POST" })
      .then((response) => response.json())
      .then((datas) => {
        Swal.fire({
          title: datas.data.title,
          text: datas.data.category + ", " + datas.data.subCategory,
          imageUrl: datas.data.image,
          imageWidth: 100,
          imageHeight: 200,
          imageAlt: "Custom image",
        });
      });
  };

  const viewDetails = (e) => {
    Swal.fire({
      title: "Order Details",
      html:
        "<div><tr><b>Width : </b><i>" +
        e.width +
        "</i></tr></br><tr><b>Height : </b><i>" +
        e.height +
        "</i></tr></br><tr><b>ArcTop : </b><i>" +
        e.arcTop +
        "</i></tr></br><tr><b>ArcBottom : </b><i>" +
        e.arcBottom +
        "</i></tr></br><tr><b>Sandwich : </b><i>" +
        e.sandwich +
        "</i></tr></br><tr><b>Varnish : </b><i>" +
        e.varnish +
        "</i></tr></br><tr><b>WhiteCoat : </b><i>" +
        e.whiteCoat +
        "</i></tr></br><tr><b>Message : </b><i>" +
        e.message +
        "</i></tr></div>",
    });
  };

  const viewMarketer = async (e) => {
    await fetch(`${API_URL}/admin/marketeer/read/${e}`, { method: "POST" })
      .then((response) => response.json())
      .then((datas) => {
        Swal.fire({
          title: "Distributer Details",
          html:
            "<div><tr><b>Name : </b><i>" +
            datas.data.name +
            "</i></tr></br><tr><b>Phone : </b><i>" +
            datas.data.phone +
            "</i></tr></br><tr><b>E mail : </b><i>" +
            datas.data.email +
            "</i></tr></br><tr><b>Status : </b><i>" +
            datas.data.active +
            "</i></tr></br></div>",
        });
      });
  };

</script>

<main>
  <div class ='row justify-content-center'>
    {#if inputs.name != ''}           
    <div class='container-fluid border p-2'>
        <h4 id="heading" class="text-center text-capitalize ">{inputs.name} Details</h4>
        <ul role="tablist" class="nav nav-tabs mt-3 mb-3 pt-4 border-top">
          <li class="nav-item flex-sm-fill">
            <a data-toggle="tab" href="#detail" role="tab" class="nav-link active">Details</a>
          </li>
          <li class="nav-item flex-sm-fill">
            <a data-toggle="tab" href="#orders" role="tab" class="nav-link">Orders</a>
          </li>
        </ul>
        <div id="myTabContent" class="tab-content">
          <div id="detail" role="tabpanel" class="tab-pane fade show active">
            <div class="p-3">
                <h6 class="">Name:</h6>
                <input type="text" class="form-control form-ipt" placeholder="Name" bind:value={inputs.name}/>
                <h6 class="">E Mail:</h6>
                <input type="email" class="form-control form-ipt text-lower" placeholder="E-mail" bind:value={inputs.email}/>
                <h6 class="">Mobile:</h6>
                <input type="text" class="form-control form-ipt" placeholder="Mobile Number" bind:value={inputs.phone}/>
                <h6 class="">Change Password:</h6>
                <input type="password" class="form-control form-ipt" placeholder="Change Password" bind:value={inputs.password}/>
                <h6 class="">Base Price:</h6>
                <input type="text" class="form-control form-ipt" placeholder="Mobile Number" bind:value={inputs.basePrice}/>
                <h6 class="">Delivery Price:</h6>
                <input type="text" class="form-control form-ipt" placeholder="Mobile Number" bind:value={inputs.deliveryPrice}/>
                <h6 class="">Address:</h6>
                <input type="text" class="form-control form-ipt" placeholder="Mobile Number" bind:value={inputs.address}/>
                <h6 class="">Status:</h6>
                  <label class="border p-2 text-uppercase ">
                    <input  type="checkbox" checked={inputs.active} on:click={chekboxx}> <b>{inputs.active}</b>
                  </label>
            </div>
            <div class="row m-auto justify-content-center p-1">
              <p class='{message.style}'><b>{message.msg}</b></p>
          </div>
            <div class="row ml-auto justify-content-center">
                <button type="button" class='btns btn btn-outline-info' on:click={updateHandle}>Update</button>
                <button type="button" class='btns btn btn-outline-danger' on:click={deleteConfirm}>Delete</button>
                <a href="/admin/user_view" class='btns btn btn-outline-secondary'>Back</a>
            </div>
          </div>
          <div id="orders" role="tabpanel" class="tab-pane fade">
            <div class=" p-2">
                <h6 class="">Ordered List:</h6>
                <div class="row">
                  <div class="col container">
                    <div class="table-responsive border">
                      <table class="table table-fill">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Marketer</th>
                            <th>Details</th>
                            <th>Category</th>
                            <th>Address</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody class="table-body">
                          {#each myJobs as item}
                            <tr>
                              <td>
                                <button class="btn btn-link" on:click={viewItem(item.product_id)} >Product</button>
                              </td>
                              <td class="text-center">
                                {#if item.status === 0}
                                  <h6>Not Assign</h6>
                                {:else}
                                  <button class="btn btn-link" on:click={viewMarketer(item.order_processed_by)} >Marketer</button>
                                {/if}
                              </td>
                              <td class="text-center">
                                <button class="btn btn-link" on:click={viewDetails(item.order_details)} >View</button>
                              </td>
                              <td class="text-center"><h6>{item.category}, {item.subCategory}</h6></td>
                              <td class="text-center"><h6>{item.shipping_address}</h6></td>
                              <td class="text-center d-block d-inline">
                                {#if item.status === 0}
                                  <h6 class="text-warning">Not Assign</h6>
                                {:else if item.status === 1}
                                  <h6>Assigned</h6>
                                {:else if item.status === 2}
                                  <h6 class="text-primary">Confirmed</h6>
                                {:else if item.status === 3}
                                  <h6 class="text-info">First Pay</h6>
                                {:else if item.status === 4}
                                  <h6 >Printing</h6>
                                {:else if item.status === 5}
                                  <h6 class="text-info">Second Pay</h6>
                                {:else if item.status === 6}
                                  <h6 class="text-success">Completed</h6>
                                {:else}
                                  <h6>Mismached</h6>
                                {/if}
                              </td>
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
    </div>
    {/if}
  </div>
</main>

<style>

#heading{
    color:#0b6e9c;
}

.form-ipt{
    width: 90%;
    background: rgb(245, 252, 255);
    color: #012630;
    border: 1px solid #0DB8DE;
    font-size: 1em;
    font-weight: 600;
    padding: 10px;
    margin-left: 10px;
    margin-bottom: 15px;
}
.btns{
    margin: 10px;
}

</style>