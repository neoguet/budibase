<script>
  import { onMount } from "svelte"
  import { Router, basepath } from "@roxi/routify"
  import { routes } from "../routify/routes"
  import { initialise } from "builderStore"
  import NotificationDisplay from "components/common/Notification/NotificationDisplay.svelte"

  onMount(async () => {
    await initialise()
  })

  $basepath = "/_builder"
</script>

<NotificationDisplay />
<Router {routes} />
