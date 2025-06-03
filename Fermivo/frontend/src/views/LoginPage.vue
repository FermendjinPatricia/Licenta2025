<template>
  <div class="login-page">
    <img src="../assets/login.jpg" alt="Background" class="background-image" />
    <div class="container">
      <form class="form" @submit.prevent="handleLogin">
        <h1>Login</h1>

        <div class="input-group">
          <label for="email">E-mail:</label>
          <input type="email" id="email" v-model="email" required />
        </div>

        <div class="input-group">
          <label for="parola">Parola:</label>
          <input type="password" id="parola" v-model="parola" required />
        </div>

        <button type="submit">Login</button>

        <div class="link-container">
          <router-link to="/register"
            >Nu ai un cont? Creează unul aici!</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      parola: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("/users/login", {
          email: this.email,
          parola: this.parola,
        });

        if (response.status === 200) {
          // Salvăm token + utilizator (ca să putem verifica rolul ulterior)
          localStorage.setItem("token", response.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.utilizator)
          );

          // Verificare rol:
          const userRole = response.data.utilizator.role;
          console.log("✅ Utilizator logat cu rol:", userRole);

          // Redirectare în funcție de rol:
          if (userRole === "seller") {
            this.$router.push("/home");
          } else if (userRole === "buyer") {
            this.$router.push("/home-buyer");
          } else if (userRole === "admin") {
            this.$router.push("/admin");
          } else {
            alert("Acces interzis pentru rolul: " + userRole);
          }
        }
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Eroare la autentificare.";
        alert(this.errorMessage);
      }
    },
  },
};
</script>

<style scoped>
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: "Inria Sans", sans-serif;
}
.form {
  background: rgba(208, 233, 150, 0.85);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  text-align: center;
}
h1 {
  color: rgba(45, 26, 0, 0.944);
  margin-bottom: 1.5rem;
  font-size: 2rem;
}
.input-group {
  text-align: left;
  margin-bottom: 1rem;
  width: 98%;
}

label {
  display: block;
  font-size: 1rem;
  color: rgba(45, 26, 0, 0.944);
  margin-bottom: 0.3rem;
}

input {
  width: 94.5%;
  padding: 0.7rem;
  border: 1px solid #999;
  border-radius: 5px;
  font-size: 1rem;
}
button {
  width: 100%;
  padding: 0.8rem;
  background-color: #307e08;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

button:hover {
  background-color: #012f19;
}
.link-container {
  margin-top: 1rem;
  text-align: center;
}

.link-container a {
  color: #613399;
  text-decoration: none;
  font-weight: bold;
}

.link-container a:hover {
  text-decoration: underline;
}
</style>
