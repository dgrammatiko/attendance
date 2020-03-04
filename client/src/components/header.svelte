<script>
  import Logoutbutton from "./Logoutbutton.svelte";
</script>

<style>
  header {
    width: 100%;
    height: 3rem;
    background-color: rgb(41, 62, 83);
    text-align: center;
    position: relative;
    position: fixed;
    top: 0;
    overflow: hidden;
    transition: all 0.5s ease;
  }

  header nav {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    bottom: 0;
    height: 3rem;
    line-height: 3rem;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>

<header>
  <nav>
    <Logoutbutton />
  </nav>
</header>
