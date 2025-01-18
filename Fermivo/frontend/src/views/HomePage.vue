<template>
  <div class="home-page">
    <h1>Bine ai venit, {{ userEmail }}!</h1>
    <p>Aceasta este pagina principală. Te-ai logat cu succes.</p>
    <button @click="handleLogout">Delogare</button>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      userEmail: "", // Aici va fi afișat email-ul utilizatorului autentificat
    };
  },
  created() {
    // Obține datele utilizatorului din localStorage (setate la login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userEmail = user.email || "Utilizator necunoscut";
    } else {
      // Dacă utilizatorul nu e autentificat, redirecționează spre Login
      this.$router.push("/");
    }
  },
  methods: {
    handleLogout() {
      // Șterge datele din localStorage
      localStorage.removeItem("user");
      // Redirecționează către pagina de login
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f8ff;
  color: #333;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #012f19;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #935313;
}
</style>
