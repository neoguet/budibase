import API from "./api"
import { enrichRows } from "./rows"

/**
 * Fetches a table definition.
 * Since definitions cannot change at runtime, the result is cached.
 */
export const fetchTableDefinition = async tableId => {
  return await API.get({ url: `/api/tables/${tableId}`, cache: true })
}

/**
 * Fetches all rows from a table.
 */
export const fetchTableData = async tableId => {
  const rows = await API.get({ url: `/api/${tableId}/rows` })
  return await enrichRows(rows, tableId)
}

/**
 * Searches a table by the specified query string.
 */
export const searchTable = async ({ tableId, query }) => {
  const rows = await API.post({
    url: `/api/${tableId}/rows/search`,
    body: { query, boolean: "AND" },
  })
  return await enrichRows(rows, tableId)
}
