<script>
  import { onMount } from "svelte";
  import Swal from "sweetalert2";

  import { API_URL } from "../../../component/constant";
  import "./tabs/style.css";

  let MarketerId = "";

  let inputs = { skip: "", limit: 200 };
  let marketers = [];
  let orders = [];

  onMount(async () => {
    fetchMarketer();
    fetchOrders();
  });

  const fetchMarketer = async () => {
    await fetch(`${API_URL}/admin/marketeer/read`, {
      method: "POST",
      body: JSON.stringify(inputs),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((datas) => {
        marketers = datas.data.marketeers;
      });
  };

  const fetchOrders = async () => {
    await fetch(`${API_URL}/order/read`, {
      method: "POST",
      body: JSON.stringify(inputs),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((datas) => {
        orders = datas.data.filter((item) => item.status === 0);
      });
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

  const assignOrder = async (e) => {
    let bodyData = { order_id: e, marketeer_id: MarketerId };

    if (MarketerId !== "") {
      const res = await fetch(`${API_URL}/admin/marketeer/assign`, {
        method: "post",
        body: JSON.stringify(bodyData),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (json.status === true) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Order Assigned",
          showConfirmButton: false,
          timer: 500,
        });
      }
      fetchOrders();
      MarketerId = "";
    }
  };

  //  function closeModal() {
  //      openModal = false;
  //  }
</script>

<main>
  <div class="container-fluid border p-2">
    <h4 class="text-secondary text-center p-2 m-2 border-bottom">
      New Order Request
    </h4>
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
                <th>Marketer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="table-body">
              {#each orders as item}
                <tr>
                  <td>
                    <button class="btn btn-link" on:click={viewItem(item.product_id)} >Product
                    </button>
                    <!-- {#if openModal==true}
                            <Modal openModal={openModal} on:closeModal={closeModal} {...item}/>
                         {/if}  -->
                  </td>
                  <td class="text-center">
                    <button class="btn btn-link" on:click={viewDistributer(item.order_placed_by)} >Distributer</button >
                  </td>

                  <td class="text-center">
                    <button class="btn btn-link" on:click={viewDetails(item.order_details)}>View</button >
                  </td>

                  <td class="text-center" ><h6>{item.category}, {item.subCategory}</h6></td >
                  <td class="text-center" ><h6>{item.shipping_address}</h6></td >
                  <td>
                    <select class="form-select" on:change={(e) => {
                        MarketerId = e.target.value;
                      }} >
                      <option value="" selected>Select.. </option>
                      {#each marketers as item}
                        <option key={item._id} value={item._id} >{item.name}</option >
                      {/each}
                    </select>
                  </td>
                  <td class="text-center d-block d-inline">
                    <button class="btn btn-outline-primary"  on:click={assignOrder(item._id)}>Assign</button >
                    <!-- <button class="btn text-success fa fa-save fa-lg" on:click={assignOrder}></button> Assign -->
                    <!-- <button class="btn text-danger fa fa-trash fa-lg"></button> -->
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .form-select {
    border: 1px solid #0db8de;
    width: 100%;
    color: #012630;
    font-size: 16px;
    font-weight: 500;
    border-radius: 5px;
    background: rgb(245, 252, 255);
  }
  .table-body td {
    vertical-align: center;
  }
</style>
