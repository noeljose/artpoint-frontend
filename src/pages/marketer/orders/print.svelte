<script>
  import "../style.css";
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import { API_URL } from "../../../component/constant";

  let orders = [];

  onMount(() => {
    fetchOrders();
  });

  const fetchOrders = async (ids) => {
    const userDetils = JSON.parse(localStorage.getItem("admin_details"));
    if (userDetils) {
      const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));
      let inputs = { _id: decodeToken._id };
      await fetch(`${API_URL}/marketeer/my_jobs`, {
        method: "POST",
        body: JSON.stringify(inputs),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((datas) => {
          orders = datas.data.filter((item) => item.status === 4);
        });
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

  const confirmOrder = async (e) => {
    let bodyData = { _id: e, status: 5 };
    const res = await fetch(`${API_URL}/order/order_status`, {
      method: "post",
      body: JSON.stringify(bodyData),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    console.log(json)
    if (json.status === true) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Second Payment Received",
        showConfirmButton: false,
        timer: 500,
      });
    }
    fetchOrders();
  };
</script>

<main>
  <div class="container-flex">
    <h4 class="text-secondary text-center p-2 m-2 border-bottom">
      Orders on Printing
    </h4>
    <div class="row">
      <div class="col">
        <div class="table-responsive border">
          <table class="table table-fill sortable">
            <thead>
              <tr>
                <th>Order By</th>
                <th>Product</th>
                <th>Details</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="m-auto align-item-center">
              {#each orders as item}
                <tr>
                  <td>
                    <button
                      class="btn btn-link"
                      on:click={viewDistributer(item.order_placed_by)}
                      >Distributer</button
                    >
                  </td>
                  <td>
                    <button
                      class="btn btn-link"
                      on:click={viewItem(item.product_id)}>View</button
                    >
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-link"
                      on:click={viewDetails(item.order_details)}
                      >Order Details</button
                    >
                  </td>
                  <td class="text-center"><h6>{item.shipping_address}</h6></td>
                  <td class="text-center">
                    <button
                      class="btn btn-outline-success"
                      on:click={confirmOrder(item._id)}>Second Payment</button
                    >
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
