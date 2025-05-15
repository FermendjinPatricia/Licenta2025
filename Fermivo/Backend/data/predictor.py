import pandas as pd
from prophet import Prophet
import re
from datetime import datetime, timedelta
import os

# 🔹 Căi fișiere
data_path = os.path.join(os.path.dirname(__file__), 'brm_cereale_all_weeks.csv')
predictii_output = os.path.join(os.path.dirname(__file__), 'brm_predictii_saptamana_viitoare.csv')

# 🔹 Încarcă datele BRM
df = pd.read_csv(data_path)

# 🔹 Curățare coloane
df['pret_lei'] = pd.to_numeric(df['pret_lei'], errors='coerce')

# 🔹 Extragem data de început din coloana 'saptamana'
def extract_start_date(s):
    match = re.search(r'(\d{1,2})\s*-\s*\d{1,2}\s+(\w+)\s+(\d{4})', s)
    if match:
        day, month_str, year = match.groups()
        months = {'ianuarie':1, 'februarie':2, 'martie':3, 'aprilie':4, 'mai':5, 'iunie':6,
                  'iulie':7, 'august':8, 'septembrie':9, 'octombrie':10, 'noiembrie':11, 'decembrie':12}
        month = months.get(month_str.lower())
        if month:
            return pd.Timestamp(year=int(year), month=month, day=int(day))
    return pd.NaT

df['date'] = df['saptamana'].apply(extract_start_date)
df = df.dropna(subset=['pret_lei', 'date'])

# 🔹 Calculăm data pentru următoarea luni reală
today = datetime.today()
days_until_next_monday = (7 - today.weekday()) % 7
if days_until_next_monday == 0:
    days_until_next_monday = 7
future_date = today + timedelta(days=days_until_next_monday)

# 🔹 Pregătim predictiile
results = []

for produs in df['produs'].unique():
    for zona in df['zona'].unique():
        subset = df[(df['produs'] == produs) & (df['zona'] == zona)].copy()

        if subset.shape[0] < 2:
            print(f"⚠️ Foarte putine date pentru {produs} - {zona} (doar {subset.shape[0]} puncte)")

        prophet_df = subset[['date', 'pret_lei']].rename(columns={'date': 'ds', 'pret_lei': 'y'})

        try:
            model = Prophet()
            model.fit(prophet_df)

            future = pd.DataFrame({'ds': [future_date]})
            forecast = model.predict(future)
            predicted_price = forecast['yhat'].values[0]

            results.append({
                'saptamana': f"Predictie {future_date.strftime('%d-%m-%Y')}",
                'zona': zona,
                'produs': produs,
                'pret_lei_predictie': round(predicted_price, 2)
            })
        except Exception as e:
            print(f"❌ Eroare la model {produs} - {zona}: {e}")

# 🔹 Salvăm predictiile
results_df = pd.DataFrame(results)
results_df.to_csv(predictii_output, index=False)

print(f"✅ Predictii salvate in {predictii_output} ({len(results_df)} randuri).")
