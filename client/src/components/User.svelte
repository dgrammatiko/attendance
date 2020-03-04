<script>
  import { onMount } from "svelte";
  import { user, users } from "../stores.js";

  export let id;

  $: currentUser = $users[id - 1];
  let firstNameValue;
  let lastNameValue;

  onMount(() => {
    if (Object.entries($user).length === 0 && $user.constructor === Object) {
      if (!firebase.auth().currentUser) {
        user.set({});
      }
    }
  });
</script>

<style>
  label {
    color: var(--hiq-color-gray-1);
  }
</style>

<div class="container hidden">
  <h1>USER id:{currentUser.id}</h1>

  <p>
    <label>
      Current id
      <input type="text" disabled bind:value={currentUser.id} />
    </label>

  </p>
  <p>
    <label>
      First Name
      <input type="text" required bind:value={currentUser.firstName} />
    </label>
  </p>
  <p>
    <label>
      Last Name
      <input type="text" required bind:value={currentUser.lastName} />
    </label>
  </p>
  <p>
    <label>
      Last Name
      <input type="text" required bind:value={currentUser.lastName} />
    </label>
  </p>
</div>
