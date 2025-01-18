import axios from '../axios';

<template>
    <div class="login-page">
      <img
        src="../assets/login.jpg"
        alt="Background"
        class="background-image"
      />
      <div class="box">
        
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <h1>Login</h1>
        <div class="row">
          <div>
            <label for="email">E-mail:</label>
            <input type="email" id="email" v-model="email" required />
          </div>
        </div>
        <div class="row">
          <div>
            <label for="parola">Parola:</label>
            <input type="parola" id="parola" v-model="parola" required />
          </div>
        </div>
        <button type="submit">Login</button>
        <div style="margin-top: 1rem; text-align: center">
          <router-link to="/register"
            >Nu ai un cont? Creează unul aici!</router-link
          >
        </div>
      </form>
    </div>
  </template>
  
  <script>
import axios from '../axios'; 

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
  async handleLogin() {
    try {
      const response = await axios.post('/users/login', {
        email: this.email,
        parola: this.parola,
      });

      if (response.status === 200) {
        // Salvează token-ul JWT în localStorage
        localStorage.setItem('token', response.data.token);

        
        this.$router.push('/home');
      }
    } catch (error) {
      this.errorMessage = error.response?.data?.message || 'Eroare la autentificare.';
      alert(this.errorMessage);
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
    margin-top: 3rem;
  }
  
  .login-form {
    background: rgba(208, 233, 150, 0.8);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
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
    border: 1px solid #ccc;
    color: rgba(45, 26, 0, 0.944);
    border-radius: 5px;
  }
  
  button {
    width: 100%;
    padding: 0.7rem;
    background-color: #307e08;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #012f19;
  }
  </style>
  