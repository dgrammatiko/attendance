<script>
  import { onMount, setContext } from "svelte";
  import User from "./User.svelte";
  import { user, users } from "../stores.js";
  import Modal from "./Modal.svelte";

  let currentUserId;

  const close = () => {
    currentUserId = null;
  };

  onMount(() => {
    if (Object.entries($user).length === 0 && $user.constructor === Object) {
      if (!firebase.auth().currentUser) {
        user.set({});
      }
    }
  });

  function nav(ev) {
    const id = ev.target.id;
    currentUserId = id;
  }
</script>

<style>
  h1 {
    color: var(--hiq-color-gray-8);
  }
  table {
    width: 750px;
    border-collapse: collapse;
    margin: 50px auto;
  }

  th {
    background: var(--hiq-color-gray-3);
    color: var(--hiq-color-gray-8);
    font-weight: bold;
  }

  td,
  th {
    color: var(--hiq-color-gray-8);
    padding: 10px;
    text-align: left;
    font-size: 1.3rem;
  }
</style>

<div>
  <h1>USERS</h1>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Edit</th>
      </tr>
    </thead>
    <tbody>
      {#if $users.length}
        {#each $users as usr}
          <tr>
            <td data-column="ID">{usr.id}</td>
            <td data-column="First Name">{usr.firstName}</td>
            <td data-column="Last Name">{usr.lastName}</td>
            <td data-column="Edit">
              <button id={usr.id} on:click={nav}>Edit</button>
            </td>
            {#if currentUserId}
              <Modal on:close={close}>
                <User id={currentUserId} />
              </Modal>
            {/if}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
