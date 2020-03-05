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

  const newUserData = {};

  onMount(() => {
    if (Object.entries($user).length === 0 && $user.constructor === Object) {
      if (!firebase.auth().currentUser) {
        user.set({});
      }
    }
  });

  // Get an image from the device
  const toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  function updateFingerPrint(ev) {
    const id = ev.target.id;
    const userId = ev.target.getAttribute("userId");
    const img = document.getElementById(`fingerprint-${id}`);
    img.src = "";
    toDataURL(
      "https://s.gravatar.com/avatar/9d99503ad68f6a0d03eb0aeb46ee9c6e?s=80"
    ).then(dataUrl => {
      debugger;
      const img = document.getElementById(`fingerprint-${id}`);
      img.src = dataUrl;
    });
  }

  function addFingerPrint(ev) {
    toDataURL(
      "https://s.gravatar.com/avatar/9d99503ad68f6a0d03eb0aeb46ee9c6e?s=80"
    ).then(dataUrl => {
      let id;
      if (Object.keys(currentUser.fingerPrints) === 0) {
        id = 1;
      } else {
        id = Object.keys(currentUser.fingerPrints).length + 1;
      }

      const userId = ev.target.getAttribute("userId");
      let img = document.querySelector(
        `#fingerprints-container-${userId} .fingerprint-${id}`
      );

      if (!img) {
        const p = document.createElement("p");
        img = document.createElement("img");
        img.classList.add(`fingerprint-${id}`);
        img.classList.add(`fingerprint-image`);
        p.append(img);

        document
          .getElementById(`fingerprints-container-${userId}`)
          .appendChild(p);
      }

      img.src = dataUrl;
    });
  }

  function getAllImages(userId) {
    let imgs = [
      ...document.querySelectorAll(
        `#fingerprints-container-${id} .fingerprint-image`
      )
    ];

    if (!newUserData[userId]) {
      newUserData[userId] = {
        fingerPrints: {},
        faceImages: {}
      };
    }

    imgs.forEach((img, i) => {
      newUserData[userId].fingerPrints[i + 1] = img.src;
    });
  }

  function handleSubmit({ detail: { values, setSubmitting, resetForm } }) {
    getAllImages(currentUser.id);
    const newUsers = [];
    $users.forEach(usr => {
      if (usr.id !== currentUser.id) {
        newUsers.push(usr);
      } else {
        const obj = {
          id: currentUser.id,
          firstName: values.firstName,
          lastName: values.lastName,
          faceImages: {},
          fingerPrints: {}
        };

        obj.faceImages = newUserData[currentUser.id].faceImages;
        obj.fingerPrints = newUserData[currentUser.id].fingerPrints;
        newUsers.push(obj);
        debugger;
        document.getElementById(
          `fingerprints-container-${currentUser.id}`
        ).innerHTML = "";
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

        console.log("Document successfully written!");
        const xx = Object.keys(newUsers).map(key => {
          return newUsers[key];
        });

        users.set(xx);
        sessionStorage.setItem("dgUsers", JSON.stringify(xx));
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
  id={currentUser.id}
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

  <h2>Fingerprints</h2>
  <div id="fingerprints-container-{currentUser.id}">
    {#if Object.keys($users[id - 1].fingerPrints).length}
      {#each Object.keys($users[id - 1].fingerPrints) as fingerPrint, i}
        <p>
          <img
            src={$users[id - 1].fingerPrints[fingerPrint]}
            alt=""
            class="fingerprint-{fingerPrint} fingerprint-image" />
        </p>

        <p>
          <button
            type="button"
            on:click={updateFingerPrint}
            id={fingerPrint}
            userId={currentUser.id}>
            Update
          </button>
        </p>
      {/each}
    {/if}
  </div>
  <p>
    <button type="button" on:click={addFingerPrint} userId={currentUser.id}>
      Add new
    </button>
  </p>

  <h2>Face Images</h2>
  {#if Object.keys(currentUser.faceImages)}
    {#each Object.keys(currentUser.faceImages) as faceImage}
      <p>
        <img src={currentUser.faceImages[faceImage]} alt="" />
      </p>
    {/each}
  {/if}

  <button type="submit" disabled={isSubmitting}>Save Changes</button>
  {#if isValid}The form is valid: {isValid}{/if}

</Form>
