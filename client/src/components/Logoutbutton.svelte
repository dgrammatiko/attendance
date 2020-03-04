<script>
  import { beforeUpdate, onMount } from "svelte";
  import { user } from "../stores.js";

  $: disabled =
    Object.entries($user).length === 0 && $user.constructor === Object;

  function logOut() {
    firebase.auth().signOut();
    sessionStorage.removeItem("dgUser");
    user.set({});
  }
</script>

<style>
  button {
    height: 3rem;
  }
</style>

<button on:click={logOut} {disabled}>Log Out</button>
