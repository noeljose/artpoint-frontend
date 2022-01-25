<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import Swal from "sweetalert2";

  import { API_URL } from "../../component/constant";

  let message = { msg: "", style: "" };
  let pwd = { msg: "", style: "" };
  let inputs = {
    _id:'',
    name: "",
    phone: "",
    email: "",
  };
  let pswd = {
    _id:'',
    old_password: "",
    new_password: "",
  };
  let myJobs =[]

  onMount(async () => {
    const userDetils = JSON.parse(localStorage.getItem("admin_details"));
    if (userDetils) {
      const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));
      inputs._id = decodeToken._id;
      inputs.name = decodeToken.name;
      inputs.phone = decodeToken.phone;
      inputs.email = decodeToken.email;
      pswd._id = decodeToken._id;
      fetchJobs(decodeToken._id)
    }
  });

  const fetchJobs=async(ids)=>{
    let bodyData={_id:ids}
    const res = await fetch(`${API_URL}/marketeer/my_jobs`,
        { method:'post',
        body:JSON.stringify(bodyData),
        headers:{'Content-Type': 'application/json'}
        })
        const json = await res.json()
        myJobs=json.data
  }

  const updateHandle = async () => {
    try {
      message.msg = "Loading..";
      const res = await fetch(`${API_URL}/marketeer/update`, {
        method: "post",
        body: JSON.stringify(inputs),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      message.style = "text-info";
      message.msg = json.message;
      if (json.status === true) {
        inputs.image = "";
      }
    } catch (error) {
      message.style = "text-warning";
      message.msg = "Network error !!";
    }
  };

  const updatePassord = async () => {
    try {
      pwd.msg = "Loading..";
      const res = await fetch(`${API_URL}/marketeer/update_password`, {
        method: "post",
        body: JSON.stringify(pswd),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      console.log(json)
      pwd.style = "text-info";
      pwd.msg = json.message;
      if (json.status === true) {
        inputs.image = "";
      }
    } catch (error) {
      pwd.style = "text-warning";
      pwd.msg = "Network error !!";
    }
  };

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

  const viewDistributer = async (e) => {
    await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" })
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
            "</i></tr></br><tr><b>Base Price : </b><i>" +
            datas.data.basePrice +
            "</i></tr></br><tr><b>Delivery Price : </b><i>" +
            datas.data.deliveryPrice +
            "</i></tr></br><tr><b>Status : </b><i>" +
            datas.data.active +
            "</i></tr></br></div>",
        });
      });
  };

</script>

<main>
  <div class="row justify-content-center">
    <div class="container-fluid border p-2">
      <h4 id="heading" class="text-center text-capitalize ">
        Profile Details
      </h4>
      <ul role="tablist" class="nav nav-tabs mt-3 mb-3 pt-4 border-top">
        <li class="nav-item flex-sm-fill">
          <a data-toggle="tab" href="#detail" role="tab" class="nav-link active"
            >Personal</a
          >
        </li>
        <li class="nav-item flex-sm-fill">
          <a data-toggle="tab" href="#password" role="tab" class="nav-link"
            >Password</a
          >
        </li>
        <li class="nav-item flex-sm-fill">
          <a data-toggle="tab" href="#orders" role="tab" class="nav-link"
            >My Jobs</a
          >
        </li>
      </ul>
      <div id="myTabContent" class="tab-content">
        <div id="detail" role="tabpanel" class="tab-pane fade show active">
          <div class="p-3">
            <h6 class="">Name:</h6>
            <input
              type="text"
              class="form-control form-ipt"
              placeholder="Name"
              bind:value={inputs.name}
            />
            <h6 class="">E Mail:</h6>
            <input
              type="email"
              class="form-control form-ipt text-lower"
              placeholder="E-mail"
              bind:value={inputs.email}
            />
            <h6 class="">Mobile:</h6>
            <input
              type="text"
              class="form-control form-ipt"
              placeholder="Mobile Number"
              bind:value={inputs.phone}
            />
          </div>
          <div class="row m-auto justify-content-center p-1">
            <p class={message.style}><b>{message.msg}</b></p>
          </div>
          <div class="row ml-auto justify-content-center">
            <button
              type="button"
              class="btns btn btn-outline-info"
              on:click={updateHandle}>Update</button
            >
            <a href="/marketer/" class="btns btn btn-outline-secondary"
              >Back</a
            >
          </div>
        </div>
        <div id="password" role="tabpanel" class="tab-pane fade">
          <div class=" p-2">
            <div class="p-3">
              <h6 class="">Old Password:</h6>
              <input
                type="password"
                class="form-control form-ipt"
                placeholder="Old Password"
                bind:value={pswd.old_password}
              />
              <h6 class="">New Password:</h6>
              <input
                type="password"
                class="form-control form-ipt"
                placeholder="Old Password"
                bind:value={pswd.new_password}
              />
            </div>
            <div class="row m-auto justify-content-center p-1">
              <p class={pwd.style}><b>{pwd.msg}</b></p>
            </div>
            <div class="row ml-auto justify-content-center">
              <button
                type="button"
                class="btns btn btn-outline-info"
                on:click={updatePassord}>Change Password</button
              >
              <a href="/marketer/" class="btns btn btn-outline-secondary"
                >Back</a
              >
            </div>
          </div>
        </div>
        <div id="orders" role="tabpanel" class="tab-pane fade">
          <div class=" p-2">
            <!-- <h6 class=""></h6> -->
            <div class="row">
              <div class="col container">
                <div class="table-responsive border">
                  <table class="table table-fill">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Ordered</th>
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
                            <button class="btn btn-link" on:click={viewDistributer(item.order_placed_by)} >Distributer</button>
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
  </div>
</main>

<style>
  #heading {
    color: #0b6e9c;
  }

  .form-ipt {
    width: 90%;
    background: rgb(245, 252, 255);
    color: #012630;
    border: 1px solid #0db8de;
    font-size: 1em;
    font-weight: 600;
    padding: 10px;
    margin-left: 10px;
    margin-bottom: 15px;
  }
  .btns {
    margin: 10px;
  }
</style>
