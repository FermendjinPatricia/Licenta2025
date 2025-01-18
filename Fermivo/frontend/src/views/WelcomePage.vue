<template>
    <div class="welcome-page">
      <img
        src="../assets/welcome.jpg"
        alt="Background"
        class="background-image"
      />
      <div  class="box"></div>
      <div class="welcome-content">
        <h1>Fermivo🌾</h1>
        <div class="welcome">
          <p>
            Bine ai venit!
          </p>
        </div>
        <div class="button-container">
          <button @click="navigateTo('login')">Login</button>
          <button @click="navigateTo('register')">Register</button>
        </div>
      </div>
    </div>
    <div  class="box1"></div>
    <div class="about">
      <button2 @click="navigateTo('about')">About Us</button2>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WelcomePage',
    methods: {
      navigateTo(page) {
        this.$router.push(`/${page}`);
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

  .welcome{
    color: rgba(45, 26, 0, 0.944);
  }

  .box{
    margin-top: 4rem;
  }

  .box1{
    margin-top: 13rem;
  }
  
  .welcome-content {
    background: rgba(237, 193, 193, 0.79);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    margin: auto;
    text-align: center;
  }
  
  h1 {
    text-align: center;
    color: rgba(45, 26, 0, 0.944);
    margin-bottom: 1rem;
  }
  
  .button-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  button {
    width: 100%;
    padding: 0.7rem;
    background-color: #303e01;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }

  button2{
    margin-top: 10rem;
    cursor: pointer;
    text-decoration: underline;
    font-size: 18px;
  }
  
  button:hover {
    background-color: #012f19;
  }

  .about{
    text-align: center;
    color: seashell;
    margin-top: 1rem;
  }

  </style>
  