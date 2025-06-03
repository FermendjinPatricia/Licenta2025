<template>
  <div class="welcome-page">
    <div class="header">
      <button class="menu-button" @click="toggleMenu">&#9776;</button>
      <router-link to="/" class="site-title">Fermivo🌾</router-link>
      <router-link to="/login" class="sign-in-button">Sign In</router-link>
    </div>
    <img src="../assets/login.jpg" alt="Background" class="background-image" />
    <div class="content-box">
      <h1>
        Bine ai venit! 👋</h1>
      <p>
        Noi suntem <strong>Fermivo</strong>, partenerul tău de încredere în agricultura digitală. <br />
        Punem în legătură fermierii și companiile, ajutându-te să cumperi, 
        să vinzi și să te dezvolți cu încredere. <br />
        Bine ai venit în viitorul agriculturii inteligente! 🚜🌾
      </p>
      <router-link to="/login" class="sign-in-button">Vino alături de noi!</router-link>
    </div>
    <nav v-if="menuOpen" class="menu">
      <ul>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <li>
          <router-link to="/check-prices"
            >Check prices on the market</router-link
          >
        </li>
        <li><router-link to="/about">About</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "HelloPage",
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
};
</script>

<style scoped>
html,
body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
}

.welcome-page {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inria Sans", sans-serif;
}
.site-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #1b5e20;
  text-decoration: none;
  font-family: "Inria Sans", sans-serif;
  cursor: pointer;
}
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.header {
  display: flex;
  justify-content: space-between;
  top: 0;
  width: 100%;
  background: rgba(253, 253, 253, 0.9);
  padding: 0rem;
  border-radius: 8px;
  z-index: 0;
}

.content-box {
  background: rgba(217, 227, 194, 0.8);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.9);
  max-width: 800px;
  width: 95%;
  text-align: left;
  position: absolute;
  top: 150%;
  margin: auto;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: rgba(0, 114, 31, 1);
}

p {
  font-size: 1.7rem;
  font-weight: bold;
  color: rgba(0, 114, 31, 1);
}

.sign-in-button {
  background-color: #1b5e20;
  color: rgb(249, 250, 248);
  text-decoration: none;
  max-height: min-content;
  padding: 0.5rem 0.5rem;
  position: relative;
  margin-top: 0.35rem;
  margin-bottom: 0.2rem;
  margin-right: 1rem;
  border-radius: 7px;
  font-size: 1rem;
}

.menu-button {
  font-size: 2rem;
  background: rgba(217, 242, 208, 1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #1b5e20;
}

.menu {
  position: absolute;
  top: 60px;
  left: 15px;
  background: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin: 10px 0;
}

.menu a {
  text-decoration: none;
  color: #1b5e20;
  font-weight: bold;
}

.menu a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .content {
    width: 90%;
    text-align: center;
    padding: 15px;
  }
  .text-box {
    padding: 15px;
  }
  h1 {
    font-size: 32px;
  }
  p {
    font-size: 16px;
  }
  .sign-in-btn {
    font-size: 14px;
    padding: 8px 16px;
  }
  .menu-btn {
    font-size: 20px;
  }
}
</style>
