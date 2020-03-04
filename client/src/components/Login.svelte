<script>
  import { user, users } from "../stores.js";

  let email;
  let password;
  const usersRef = firebase
    .firestore()
    .collection("brussels")
    .doc("users");

  // Handles the form submit
  function handleSubmit(event) {
    const form = event.target;
    if (Object.entries($user).length === 0 && $user.constructor === Object) {
      if (!form.checkValidity()) {
        return;
      }

      // Sign in with email and pass.
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(_ => {
          const currentUserTmp = firebase.auth().currentUser;
          user.set(currentUserTmp);
          sessionStorage.setItem("dgUser", currentUserTmp);
          usersRef
            .get()
            .then(doc => {
              if (doc.exists) {
                return doc.data();
                console.log("Document data:", doc.data());
              } else {
                console.log("No such document!");
                return null;
              }
            })
            .then(data => {
              const xx = Object.keys(data).map(key => {
                return data[key];
              });

              users.set(xx);
              sessionStorage.setItem("dgUsers", xx);
            })
            .catch(err => console.log(err));
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === "auth/wrong-password") {
            alert("Wrong password.");
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
    }
  }
</script>

<style>
  .login-container {
    position: relative;
    min-height: 100%;
    width: 100%;
    max-width: 32rem;
    padding: 5rem 2rem 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .title-container {
    position: relative;
  }

  .title {
    font-size: 26px;
    color: #eee;
    margin: 0 auto 40px auto;
    text-align: center;
    font-weight: 700;
  }

  input:invalid {
    box-shadow: 0 0 5px 1px red;
  }

  input:focus:invalid {
    box-shadow: none;
  }
</style>

<form class="login-container" on:submit|preventDefault={handleSubmit}>
  <div class="title-container">
    <h3 class="title">Administration</h3>
  </div>
  <p>
    <input
      required
      autocomplete="email"
      id="email"
      type="text"
      placeholder="Email"
      name="email"
      bind:value={email} />
  </p>
  <p>
    <input
      required
      autocomplete="current-password"
      id="password"
      type="password"
      placeholder="Password"
      name="password"
      bind:value={password} />
  </p>
  <button type="submit" style="width: 100%;">
    <span>Login</span>
  </button>
</form>
