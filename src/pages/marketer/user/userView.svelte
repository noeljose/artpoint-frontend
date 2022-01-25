<script>
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import { API_URL } from "../../../component/constant";

  export let id;

  let message = { msg: "", style: "" };
  let inputs = {
    name: "",
    phone: "",
    email: "",
    password: "",
    basePrice: "",
    deliveryPrice: "",
    active: false,
  };
  let myJobs = [];

  onMount(async () => {
    await fetch(`${API_URL}/admin/distributer/read/${id}`, { method: "POST" })
      .then((response) => response.json())
      .then((datas) => {
        inputs = datas.data;
      });

    const userDetils = JSON.parse(localStorage.getItem("admin_details"));
    if (userDetils) {
      const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));

      let bodyData = { _id: id };
      const res = await fetch(`${API_URL}/distributer/my_orders`, {
        method: "post",
        body: JSON.stringify(bodyData),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      myJobs = json.data.filter(item=>item.order_processed_by===decodeToken._id)
    }
  });

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
</script>

<main>
  <div class="row justify-content-center m-2">
    {#if inputs.name != ""}
      <div class="container-fluid border p-2">
        <h4 id="heading" class="text-center text-capitalize ">
          {inputs.name} Details
        </h4>
        <ul role="tablist" class="nav nav-tabs mt-3 mb-3 pt-4 border-top">
          <li class="nav-item flex-sm-fill">
            <a
              data-toggle="tab"
              href="#detail"
              role="tab"
              class="nav-link active">Details</a
            >
          </li>
          <li class="nav-item flex-sm-fill">
            <a data-toggle="tab" href="#orders" role="tab" class="nav-link"
              >Orders</a
            >
          </li>
        </ul>
        <div id="myTabContent" class="tab-content">
          <div id="detail" role="tabpanel" class="tab-pane fade show active">
            <div class="p-3 table-responsive">
              <table class="table ">
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <th>{inputs.name}</th>
                  </tr>
                  <tr>
                    <td>E-Mail:</td>
                    <th>{inputs.email}</th>
                  </tr>
                  <tr>
                    <td>Mobile:</td>
                    <th>{inputs.phone}</th>
                  </tr>
                  <tr>
                    <td>Base Price:</td>
                    <th>{inputs.basePrice}</th>
                  </tr>
                  <tr>
                    <td>Delivery Price:</td>
                    <th>{inputs.deliveryPrice}</th>
                  </tr>
                  <tr>
                    <td>Address:</td>
                    <th>{inputs.address}</th>
                  </tr>
                  <tr>
                    <td>Status:</td>
                    <th>{inputs.active}</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="row justify-content-end mr-5">
              <a
                href="/marketer/user_list"
                class="btns btn btn-outline-secondary">Back</a
              >
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
                              <button
                                class="btn btn-link"
                                on:click={viewItem(item.product_id)}
                                >Product</button
                              >
                            </td>
                            <td class="text-center">
                              <button
                                class="btn btn-link"
                                on:click={viewDetails(item.order_details)}
                                >View</button
                              >
                            </td>
                            <td class="text-center"
                              ><h6>{item.category}, {item.subCategory}</h6></td
                            >
                            <td class="text-center"
                              ><h6>{item.shipping_address}</h6></td
                            >
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
                                <h6>Printing</h6>
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
  #heading {
    color: #0b6e9c;
  }

  .table th {
    text-transform: capitalize;
  }
  .btns {
    margin: 10px;
  }
</style>
