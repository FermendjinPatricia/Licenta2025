<template>
  <div class="edit-profile">
    <h1>Editează Profilul</h1>

    <div class="profile-card">
      <img :src="previewPicture" class="profile-picture" />
      <label for="profilePicture">Schimbă poza de profil</label><br />
      <input type="file" @change="handleFileChange" accept="image/*" />
    </div>

    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label>Nume</label>
        <input v-model="formData.nume" type="text" required />
      </div>

      <div class="form-group">
        <label>Prenume</label>
        <input v-model="formData.prenume" type="text" required />
      </div>

      <div class="form-group">
        <label>Denumire Firmă</label>
        <input v-model="formData.denumireaFirmei" type="text" />
      </div>

      <div class="form-group">
        <label>Adresă</label>
        <input v-model="formData.adresa" type="text" />
      </div>

      <div class="form-group">
        <label>Telefon</label>
        <input v-model="formData.telefon" type="text" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="formData.email" type="email" disabled />
      </div>

      <button type="submit" class="save-button">Salvează</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditProfile",
  data() {
    return {
      formData: {
        nume: "",
        prenume: "",
        email: "",
        denumireaFirmei: "",
        adresa: "",
        telefon: "",
        profilePicture: "",
      },
      selectedFile: null,
    };
  },
  computed: {
    previewPicture() {
      if (this.selectedFile) {
        return URL.createObjectURL(this.selectedFile);
      }
      return this.formData.profilePicture
        ? `http://localhost:5000/uploads/${this.formData.profilePicture}`
        : `http://localhost:5000/uploads/default_profile.jpg`;
    },
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?._id;
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        if (response.data.success) {
          this.formData = { ...response.data.user };
        }
      } catch (error) {
        console.error("❌ Eroare la încărcarea datelor:", error);
      }
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async updateProfile() {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?._id;

        // Upload poza dacă e selectată
        if (this.selectedFile) {
          const formDataImage = new FormData();
          formDataImage.append("profilePicture", this.selectedFile);

          const token = localStorage.getItem("token");

          const uploadResponse = await axios.post(
            "http://localhost:5000/api/users/upload-profile",
            formDataImage,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (uploadResponse.data.success) {
            this.formData.profilePicture = uploadResponse.data.filename;
          }
        }

        // Update date profil
        const updateResponse = await axios.put(
          `http://localhost:5000/api/users/${userId}`,
          {
            nume: this.formData.nume,
            prenume: this.formData.prenume,
            denumireaFirmei: this.formData.denumireaFirmei,
            adresa: this.formData.adresa,
            telefon: this.formData.telefon,
            profilePicture: this.formData.profilePicture,
          }
        );

        if (updateResponse.data.success) {
          alert("✅ Profil actualizat cu succes!");

          // Actualizează user-ul și localStorage-ul
          const updatedUser = updateResponse.data.user;
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Redirect în funcție de rol
          if (updatedUser.role === "seller") {
            this.$router.push("/home");
          } else if (updatedUser.role === "buyer") {
            this.$router.push("/home-buyer");
          } else if (updatedUser.role === "admin") {
            this.$router.push("/admin-dashboard");
          } else {
            this.$router.push("/login"); // fallback
          }
        }
      } catch (error) {
        console.error("❌ Eroare la actualizare profil:", error);
        alert("Eroare la salvarea profilului.");
      }
    },
  },
};
</script>

<style scoped>
.edit-profile {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  color: #1b5e20;
}

.profile-card {
  text-align: center;
  margin-bottom: 1rem;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1b5e20;
  margin-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

input[type="text"],
input[type="email"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.save-button {
  width: 100%;
  padding: 0.7rem;
  background: #1b5e20;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.save-button:hover {
  background: #093b12;
}
</style>
