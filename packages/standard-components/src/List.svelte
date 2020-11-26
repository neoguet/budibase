<script>
  import { getContext, onMount } from "svelte"
  import { isEmpty } from "lodash/fp"
  import { Input, Button } from "@budibase/bbui"
  import SingleLinkedRowSelector from "./SingleLinkedRowSelector.svelte"

  const { API, styleable, DataProvider, builderStore } = getContext("sdk")
  const component = getContext("component")
  const dataContext = getContext("data")

  export let datasource = []
  export let searchable = false
  export let searchFields = []

  let rows = []
  let allRows = []
  let schema
  let searchCriteria = {}
  let loading = false

  onMount(async () => {
    if (isEmpty(datasource)) {
      return
    }

    if (searchable) {
      const table = await API.fetchTableDefinition(datasource.tableId)
      schema = table.schema
    }

    // Fetch all records if not searchable
    if (!searchable || $builderStore.inBuilder) {
      loading = true
      rows = await API.fetchDatasource(datasource, $dataContext)
      loading = false
    }
  })

  const search = async () => {
    // Lowercase everything for searching
    let query = {}
    Object.entries(searchCriteria).forEach(([key, value]) => {
      query[key] = value == null ? null : value.toLowerCase().trim()
    })
    loading = true
    rows = await API.searchTable({ tableId: datasource.tableId, query })
    loading = false
  }
</script>

<div use:styleable={$component.styles}>
  {#if searchable && schema}
    <div class="search">
      {#each searchFields as field}
        {#if schema[field].type === 'string'}
          <div>
            <Input bind:value={searchCriteria[field]} label={field} />
          </div>
        {:else if schema[field].type === 'link'}
          <div>
            <SingleLinkedRowSelector
              secondary
              bind:linkedRow={searchCriteria[field]}
              schema={schema[field]} />
          </div>
        {/if}
      {/each}
    </div>
    <div class="search-button">
      <Button primary on:click={search} disabled={loading}>Search</Button>
    </div>
  {/if}

  {#if rows && rows.length}
    <div class="results" class:searchable>
      {#each rows as row}
        <DataProvider {row}>
          <slot />
        </DataProvider>
      {/each}
    </div>
  {/if}
</div>

<style>
  .search {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-xl);
  }
  .search > div {
    flex: 1 1 0;
  }
  .search-button {
    margin-top: var(--spacing-xl);
  }

  .results.searchable {
    margin-top: var(--spacing-xl);
  }
</style>
