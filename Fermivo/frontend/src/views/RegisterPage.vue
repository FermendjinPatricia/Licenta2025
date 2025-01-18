<template>
  <div class="register-page">
    <img
      src="../assets/register.jpg"
      alt="Background"
      class="background-image"
    />
    <div class="box"></div>
    <form class="register-form" @submit.prevent="handleRegister">
      <h1>Register</h1>
      <div class="row">
        <div>
          <label for="nume">Nume:</label>
          <input type="text" id="nume" v-model="nume" required />
        </div>
        <div>
          <label for="prenume">Prenume:</label>
          <input type="text" id="prenume" v-model="prenume" required />
        </div>
      </div>
      <div class="row">
        <div>
          <label for="denumireaFirmei">Denumirea Firmei:</label>
          <input
            type="text"
            id="denumireaFirmei"
            v-model="denumireaFirmei"
            required
          />
        </div>
        <div>
          <label for="codUnicDeIdentificare">Cod unic de identificare:</label>
          <input
            type="text"
            id="codUnicDeIdentificare"
            v-model="codUnicDeIdentificare"
            required
          />
        </div>
      </div>
      <div class="row">
        <div>
          <label for="adresa">Adresa:</label>
          <input type="text" id="adresa" v-model="adresa" required />
        </div>
        <div>
          <label for="telefon">Telefon:</label>
          <input type="tel" id="telefon" v-model="telefon" required />
        </div>
      </div>
      <div class="row">
        <div>
          <label for="email">E-mail:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="parola">Parola:</label>
          <input type="password" id="parola" v-model="parola" required />
        </div>
      </div>
      <button type="submit">Register</button>
      <div style="margin-top: 1rem; text-align: center">
        <router-link to="/login">Ai deja un cont? Conectează-te acum!</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  name: 'RegisterPage',
  data() {
    return {
      nume: '',
      prenume: '',
      denumireaFirmei: '',
      codUnicDeIdentificare: '',
      adresa: '',
      telefon: '',
      email: '',
      parola: '',
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await axios.post('/users/register', {
          nume: this.nume,
          prenume: this.prenume,
          denumireaFirmei: this.denumireaFirmei,
          codUnicDeIdentificare: this.codUnicDeIdentificare,
          adresa: this.adresa,
          telefon: this.telefon,
          email: this.email,
          parola: this.parola,
        });

        if (response.status === 201) {
          alert('Cont creat cu succes!');
          this.$router.push('/');
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Eroare la înregistrare.');
      }
    },
  },
};
</script>


<style scoped>
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.box {
  margin-top: 2rem;
}

.register-form {
  background: rgba(218, 172, 111, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: rgba(45, 26, 0, 0.944);
  margin-bottom: 1rem;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 10rem;
  margin-bottom: 1rem;
}

.row div {
  flex: 1;
}

label {
  display: block;
  color: rgba(45, 26, 0, 0.944);
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #db8307;
  color: rgba(45, 26, 0, 0.944);
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 0.7rem;
  background-color: #935313;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #012f19;
}
</style>
