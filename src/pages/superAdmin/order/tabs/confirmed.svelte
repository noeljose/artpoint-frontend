<script>
  import {API_URL} from '../../../../component/constant'
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import './style.css'

  let orders = [];
  let inputs = { skip: "", limit: 200 };

  onMount(() => {
    fetchOrders();
  });

  const fetchOrders = async () => {
    await fetch(`${API_URL}/order/read`, {
      method: "POST",
      body: JSON.stringify(inputs),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((datas) => {
        orders = datas.data.filter((item) => item.status === 2);
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
    <div class="container-flex">
        <div class="row">
        <div class="col">
              <div class="table-responsive border">
                <table class="table table-fill sortable">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Marketer</th>
                      <th>Ordered By</th>
                      <th>Order Details</th>
                    </tr>
                  </thead>
                  <tbody class="m-auto align-item-center">
                    {#each orders as item}
                        <tr>
                        <td><button class="btn btn-link" on:click={viewItem(item.product_id)} >Product</button></td>
                        <td><button class="btn btn-link" on:click={viewMarketer(item.order_processed_by)} >Marketer</button ></td>
                        <td class='text-center'><button class="btn btn-link" on:click={viewDistributer(item.order_placed_by)} >Distributer</button ></td>
                        <td class='text-center'><a class="col-sm-3 btn btn-link" href="/admin/orders/{item._id}">View</a></td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
          </div>
        </div>
      </div>
    </div>
</main>
