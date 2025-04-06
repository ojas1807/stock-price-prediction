import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor

# Load dataset
df = pd.read_csv("data/stock_data.csv")

# Fill NaN values in Moving_Avg_10 with the mean
df.fillna({"Moving_Avg_10": df["Moving_Avg_10"].mean()}, inplace=True)


# Define features and target
features = ["Open", "High", "Low", "Volume", "Moving_Avg_10"]
target = "Close"

X = df[features]
y = df[target]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train models
lr_model = LinearRegression()
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)

lr_model.fit(X_train_scaled, y_train)
rf_model.fit(X_train_scaled, y_train)

# Save models and scaler
with open("models/lr_model.pkl", "wb") as f:
    pickle.dump(lr_model, f)
with open("models/rf_model.pkl", "wb") as f:
    pickle.dump(rf_model, f)
with open("models/scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

print("✅ Models trained and saved successfully!")
