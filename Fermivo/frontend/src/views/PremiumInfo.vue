<template>
  <div class="premium-info">
    <h1>Descoperă contul Premium Fermivo! 🌟</h1>
    <p v-if="isSeller">
      Ești vânzător? Iată beneficiile tale:
    </p>
    <p v-else-if="isBuyer">
      Ești cumpărător? Iată beneficiile tale:
    </p>
    <p v-else>
      Aici sunt beneficiile contului Premium:
    </p>

    <ul>
      <li v-if="isSeller">✅ Anunțuri promovate – produsele tale apar primele în lista cumpărătorilor.</li>
      <li>✅ Toate prețurile la zi, fără restricții.</li>
      <li v-if="isBuyer">✅ Tracking GPS – vezi în timp real unde sunt camioanele tale!</li>
    </ul>

    <p>Preț: doar 2 EUR/lună – pentru creșterea vânzărilor și încrederea cumpărătorilor.</p>

    <button @click="activatePremium" class="activate-button">Activează Premium</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || {}
    };
  },
  computed: {
    isSeller() {
      return this.user.role === "seller";
    },
    isBuyer() {
      return this.user.role === "buyer";
    }
  },
  methods: {
    async activatePremium() {
      try {
        const response = await this.$axios.post('/payments-premium/create-checkout-session', {
          userId: this.user._id
        });
        window.location.href = response.data.url;
      } catch (error) {
        console.error(error);
        alert('Eroare la inițierea plății.');
      }
    }
  }
};
</script>

<style scoped>
.premium-info {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  font-family: 'Inria Sans', sans-serif;
}

.premium-info h1 {
  margin-bottom: 1rem;
  color: #333;
}

.premium-info ul {
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
  text-align: left;
}

.premium-info li {
  margin-bottom: 0.5rem;
}

.activate-button {
  background-color: #f5b301;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
