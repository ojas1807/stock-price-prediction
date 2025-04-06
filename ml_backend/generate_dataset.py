import pandas as pd
import numpy as np

# Generate a new dataset
np.random.seed(42)
data = {
    "Date": pd.date_range(start="2023-01-01", periods=1000, freq="D"),
    "Open": np.random.uniform(100, 500, 1000),
    "High": np.random.uniform(100, 500, 1000),
    "Low": np.random.uniform(100, 500, 1000),
    "Close": np.random.uniform(100, 500, 1000),
    "Volume": np.random.randint(1000, 5000, 1000),
}

df = pd.DataFrame(data)
df["Moving_Avg_10"] = df["Close"].rolling(window=10).mean()

# Save to CSV
df.to_csv("data/stock_data.csv", index=False)
print("✅ New dataset created successfully!")
