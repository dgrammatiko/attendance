<script>
  import { onMount, setContext } from "svelte";
  import Header from "./components/header.svelte";
  import User from "./components/User.svelte";
  import Users from "./components/Users.svelte";
  import Login from "./components/Login.svelte";
  import { user, users } from "./stores.js";

  $: showLogin =
    Object.entries($user).length === 0 && $user.constructor === Object;

  onMount(() => {
    /* Keep track of the user state */
    firebase.auth().onAuthStateChanged(function(usr) {
      if (!usr) {
        user.set({});
        showLogin = true;
      }
    });
  });
</script>

<style>
  section {
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(21, 32, 43);
  }
</style>

<section>
  <Header />
  {#if showLogin}
    <Login />
  {:else}
    <Users />
  {/if}
</section>
