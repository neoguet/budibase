import * as API from "./api"
import {
  authStore,
  routeStore,
  screenStore,
  bindingStore,
  builderStore,
} from "./store"
import { styleable } from "./utils/styleable"
import { getAppId } from "./utils/getAppId"
import { link as linkable } from "svelte-spa-router"
import DataProvider from "./components/DataProvider.svelte"

export default {
  API,
  authStore,
  routeStore,
  screenStore,
  builderStore,
  styleable,
  linkable,
  getAppId,
  DataProvider,
  setBindableValue: bindingStore.actions.setBindableValue,
}
