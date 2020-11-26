<script>
  import { Label, Select } from "@budibase/bbui"
  import { capitalise } from "./helpers"
  import { getContext } from "svelte"

  const { API } = getContext("sdk")

  export let schema = {}
  export let linkedRow
  export let showLabel = true
  export let secondary

  let linkedTable
  let allRows = []

  $: label = capitalise(schema.name)
  $: linkedTableId = schema.tableId
  $: fetchRows(linkedTableId)
  $: fetchTable(linkedTableId)

  async function fetchTable(id) {
    if (id != null) {
      linkedTable = await API.fetchTableDefinition(id)
    }
  }

  async function fetchRows(id) {
    if (id != null) {
      allRows = await API.fetchTableData(id)
    }
  }

  function getPrettyName(row) {
    return row[(linkedTable && linkedTable.primaryDisplay) || "_id"]
  }
</script>

{#if linkedTable != null}
  {#if linkedTable.primaryDisplay == null}
    {#if showLabel}
      <Label extraSmall grey>{label}</Label>
    {/if}
    <Label small black>
      Please choose a display column for the
      <b>{linkedTable.name}</b>
      table.
    </Label>
  {:else}
    <Select {secondary} bind:value={linkedRow} label={showLabel ? label : null}>
      <option value="">Choose an option</option>
      {#each allRows as row}
        <option value={row._id}>{getPrettyName(row)}</option>
      {/each}
    </Select>
  {/if}
{/if}
