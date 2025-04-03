// brmScraper.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: 'brm_cereale_all_weeks.csv',
  header: [
    { id: 'saptamana', title: 'saptamana' },
    { id: 'zona', title: 'zona' },
    { id: 'produs', title: 'produs' },
    { id: 'pret_lei', title: 'pret_lei' },
    { id: 'variatie_procente', title: 'variatie_procente' }
  ]
});

(async () => {
  try {
    const url = 'https://brm.ro/cotatii-cereale/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const rows = $('#tablepress-16 tr');
    let currentWeek = '';
    let currentHeaders = [];
    let allData = [];

    rows.each((i, el) => {
      const th = $(el).find('th');
      const td = $(el).find('td');

      if (th.length && th.attr('colspan') === '9') {
        // 🟢 Detectăm săptămâna curentă (ex. SAPTAMANA 12)
        currentWeek = th.text().trim();
      } else if (td.length === 1 && td.text().includes('SAPTAMANA')) {
        // 🟢 Detectăm următoarele săptămâni
        currentWeek = td.text().trim();
      } else if (td.length === 9 && td.eq(0).text().toUpperCase().includes('ZONA DE LIVRARE')) {
        // 🟡 Header de coloană pentru produse (ignorat, dar reținem titluri)
        currentHeaders = td.map((i, cell) => $(cell).text().trim()).get();
      } else if (td.length === 9) {
        // 🟢 Datele pe rând
        const zona = td.eq(0).text().trim();
        for (let i = 1; i < 9; i += 2) {
          const produs = currentHeaders[i] || `Produs ${i}`;
          const pret = td.eq(i).text().trim().replace(',', '.');
          const variatie = td.eq(i + 1).text().trim().replace(',', '.');

          if (zona && produs && pret) {
            allData.push({
              saptamana: currentWeek,
              zona,
              produs,
              pret_lei: isNaN(parseFloat(pret)) ? '-' : parseFloat(pret),
              variatie_procente: isNaN(parseFloat(variatie)) ? '-' : parseFloat(variatie)
            });
          }
        }
      }
    });

    await csvWriter.writeRecords(allData);
    console.log(`✅ ${allData.length} înregistrări salvate în brm_cereale_all_weeks.csv`);
  } catch (error) {
    console.error('❌ Eroare la scraping BRM:', error);
  }
})();
