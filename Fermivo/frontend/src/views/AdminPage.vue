<template>
  <div class="admin-page">
    <h1>👑 Panou de Administrare</h1>

    <section>
      <h2>📢 Rapoarte utilizatori</h2>
      <table>
        <thead>
          <tr>
            <th>Reporter</th>
            <th>Raportat</th>
            <th>Motiv</th>
            <th>Descriere</th>
            <th>Dată</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reports" :key="r._id">
            <td>{{ r.reporterId.email }}</td>
            <td>{{ r.reportedId.email }}</td>
            <td>{{ r.reason }}</td>
            <td>{{ r.description }}</td>
            <td>{{ new Date(r.createdAt).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>👥 Utilizatori</h2>
      <ul>
        <li v-for="u in users" :key="u._id">
          {{ u.email }} - Rol: {{ u.role }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  name: "AdminPage",
  data() {
    return {
      reports: [],
      users: [],
    };
  },
  async created() {
    const [reportsRes, usersRes] = await Promise.all([
      axios.get("/reports"),
      axios.get("/users/all"),
    ]);
    this.reports = reportsRes.data.reports;
    this.users = usersRes.data.users;
  },
};
</script>

<style scoped>
.admin-page {
  padding: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

th, td {
  border: 1px solid #ccc;
  padding: 0.6rem;
  text-align: left;
}
</style>
