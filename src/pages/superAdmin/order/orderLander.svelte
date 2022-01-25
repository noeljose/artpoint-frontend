<script>
    import Assigned from './tabs/assigned.svelte'
    import Confirm  from './tabs/confirmed.svelte'
    import First from './tabs/first.svelte'
    import Print from './tabs/print.svelte'
    import Second from './tabs/second.svelte'
</script>

<main>
    <div class='container-fluid'>
        <ul role="tablist" class="nav nav-tabs mt-3 mb-3">
          <li class="nav-item flex-sm-fill">
            <a data-toggle="tab" href="#assigned" role="tab" class="nav-link active">Assigned</a>
          </li>
          <li class="nav-item flex-sm-fill">
            <a data-toggle="tab" href="#confirm" role="tab" class="nav-link">Confirmed</a>
          </li>
          <li class="nav-item flex-sm-fill">
            <a data-toggle="tab" href="#first" role="tab" class="nav-link">First Pay</a>
          </li>
          <li class="nav-item flex-sm-fill">
            <a data-toggle="tab" href="#print" role="tab" class="nav-link">Print</a>
          </li>
          <li class="nav-item flex-sm-fill">
            <a data-toggle="tab" href="#second" role="tab" class="nav-link">Second Pay</a>
          </li>
        </ul>
        <div id="myTabContent" class="tab-content">
          <div id="assigned" role="tabpanel" class="tab-pane fade show active">
            <Assigned/>
          </div>
          <div id="confirm" role="tabpanel" class="tab-pane fade ">
            <Confirm/>
          </div>
          <div id="first" role="tabpanel" class="tab-pane fade">
            <First/>
          </div>
          <div id="print" role="tabpanel" class="tab-pane fade">
            <Print/>
          </div>
          <div id="second" role="tabpanel" class="tab-pane fade">
            <Second/>
          </div>
        </div>
    </div>
</main>