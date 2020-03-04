<script>
  import { Form, Input } from "sveltejs-forms";
  import * as yup from "yup";
  import { onMount } from "svelte";
  import { user, users } from "../stores.js";
  import { createEventDispatcher, onDestroy } from "svelte";

  export let id;

  const usersRef = firebase
    .firestore()
    .collection("brussels")
    .doc("users");

  $: currentUser = $users[id - 1];

  onMount(() => {
    if (Object.entries($user).length === 0 && $user.constructor === Object) {
      if (!firebase.auth().currentUser) {
        user.set({});
      }
    }
  });

  function handleSubmit({ detail: { values, setSubmitting, resetForm } }) {
    const newUsers = [];
    $users.forEach(usr => {
      if (usr.id !== currentUser.id) {
        newUsers.push(usr);
      } else {
        newUsers.push({
          id: currentUser.id,
          firstName: values.firstName,
          lastName: values.lastName,
          faceImages: {},
          fingerPrints: {}
        });
      }
    });

    const firebaseObj = {};
    newUsers.forEach((x, i) => {
      firebaseObj[i + 1] = x;
    });
    console.log(newUsers);
    usersRef
      .set(firebaseObj)
      .then(function() {
        const dispatch = createEventDispatcher();
        dispatch("close");
        users.set(newUsers);
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  }

  function handleReset() {
    console.log("form has been reset");
  }

  const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required()
  });

  $: initialValues = {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName
  };
</script>

<style>
  label {
    color: var(--hiq-color-gray-1);
  }
  :global(.field) {
    margin: 2rem 0;
  }
</style>

<h1>USER id:{currentUser.id}</h1>
<Form
  {schema}
  {initialValues}
  validateOnBlur={true}
  validateOnChange={true}
  on:submit={handleSubmit}
  on:reset={handleReset}
  let:isSubmitting
  let:isValid>
  <input type="text" name="id" disabled bind:value={currentUser.id} />
  <Input
    name="firstName"
    type="text"
    label="First Name"
    placeholder="First Name" />
  <Input
    name="lastName"
    type="text"
    label="Last Name"
    placeholder="Last Name" />

  <button type="reset">Reset</button>
  <button type="submit" disabled={isSubmitting}>Save Changes</button>
  The form is valid: {isValid}
</Form>
