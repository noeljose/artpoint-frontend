<script>
    import {API_URL} from '../../../../component/constant'
    import { onMount } from "svelte";
import Login from '../../../auth/login.svelte';

    export let id;

    let Order=[]
    let details=[]

    onMount(() => {
        fetchOrder();
    });

    const fetchOrder = async()=>{
        let bodyData = { order_id: id};
        const res = await fetch(`${API_URL}/order/single_order_view`, {
            method: "post",
            body: JSON.stringify(bodyData),
            headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        Order = json.data
        details =json.data.order_details
    }

</script>

<main>
    <div class="container-fluid border p-2">
        <h4 class="text-secondary text-center p-2 m-2 border-bottom">Order Details</h4>
        <div class="container row justify-content-center p-4">
            <div class="col">
                <div class="table table-responsive">
                    <table class="border bg-light">
                        <tbody>
                            <tr>
                                <th scope="row">Category Name:</th>
                                <td>{Order.category}</td>
                            </tr>
                            <tr>
                                <th scope="row">SubCategory:</th>
                                <td>{Order.subCategory}</td>
                            </tr>
                            <tr>
                                <th scope="row">Shipping Address:</th>
                                <td>{Order.shipping_address}</td>
                            </tr>
                            <tr>
                                <th scope="row">Order Details:</th>
                                <table>
                                    <tr>
                                        <td>Width: {details.width}</td>
                                    </tr>
                                    <tr>
                                        <td>Height: {details.height}</td>
                                    </tr>
                                    <tr>
                                        <td>Arc Top: {details.arcTop}</td>
                                    </tr>
                                    <tr>
                                        <td>Arc Bottom: {details.arcBottom}</td>
                                    </tr>
                                    <tr>
                                        <td>Varnish: {details.varnish}</td>
                                    </tr>
                                    <tr>
                                        <td>White-Coat: {details.whiteCoat}</td>
                                    </tr>
                                    <tr>
                                        <td>Sandwich: {details.sandwich}</td>
                                    </tr>
                                </table>
                            </tr>
                            <tr>
                                <th scope="row">Message:</th>
                                <td>{details.message}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</main>