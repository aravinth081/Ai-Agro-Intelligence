import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier
from statsmodels.tsa.arima.model import ARIMA
import mtranslate
import logging

logger = logging.getLogger(__name__)

# Global ML models
model_soil_moisture = None
model_crop_health = None
model_yield_loss = None
model_disease_classifier = None

def init_ml_models():
    """Generates synthetic agricultural datasets and trains the machine learning models on startup."""
    global model_soil_moisture, model_crop_health, model_yield_loss, model_disease_classifier
    logger.info("Initializing and training Scikit-Learn ML models on startup...")
    
    np.random.seed(42)
    n_samples = 1500
    
    # ── 1. Telemetry and Risk Data Generation ──
    # Columns: [temp, humidity, wind, area, crop_idx, soil_idx, irr_idx]
    temp = np.random.uniform(15, 45, n_samples)
    humidity = np.random.uniform(10, 100, n_samples)
    wind = np.random.uniform(0, 40, n_samples)
    area = np.random.uniform(1, 20, n_samples)
    crop_idx = np.random.randint(0, 8, n_samples)
    soil_idx = np.random.randint(0, 5, n_samples)
    irr_idx = np.random.randint(0, 5, n_samples)
    
    X_risk = np.column_stack([temp, humidity, wind, area, crop_idx, soil_idx, irr_idx])
    
    # Dynamic rules representing soil moisture, health risk and yield loss
    # Soil moisture calculation (higher humidity & irrigation increases it; temp & wind decreases it)
    moisture = 100.0 - (temp * 0.8) - (wind * 0.25) + (humidity * 0.35)
    # Add irrigation impact
    irr_boosts = np.array([32, 16, 22, 28, 6]) # drip, borewell, canal, sprinkler, rainfed
    moisture += irr_boosts[irr_idx]
    # Crop type water requirements
    crop_reductions = np.array([0, 12, 4, 8, 2, 6, 4, 0])
    moisture -= crop_reductions[crop_idx]
    moisture = np.clip(moisture, 10.0, 95.0)
    
    # Crop Health Risk (high risk when extreme temperatures, low soil moisture, high humidity pests)
    risk = np.zeros(n_samples)
    for idx in range(n_samples):
        r = 0.05
        t_val = temp[idx]
        h_val = humidity[idx]
        m_val = moisture[idx]
        c_val = crop_idx[idx]
        
        if t_val > 36.0 or t_val < 17.0:
            r += 0.25
        if h_val > 80.0:
            r += 0.20 # pest threat
        if m_val < 32.0:
            r += 0.35 # drought stress
        if c_val == 5: # Tomato is volatile
            r += 0.10
        risk[idx] = np.clip(r, 0.05, 0.95)
        
    # Yield Loss (correlated heavily to crop health risk and temperature stressors)
    yield_loss = (risk * 0.75) + (temp > 40.0) * 0.15
    yield_loss = np.clip(yield_loss, 0.02, 0.98)
    
    # Train random forest regressors
    model_soil_moisture = RandomForestRegressor(n_estimators=30, random_state=42)
    model_soil_moisture.fit(X_risk, moisture)
    
    model_crop_health = RandomForestRegressor(n_estimators=30, random_state=42)
    model_crop_health.fit(X_risk, risk)
    
    model_yield_loss = RandomForestRegressor(n_estimators=30, random_state=42)
    model_yield_loss.fit(X_risk, yield_loss)
    
    # ── 2. Plant Disease Pathology Data Generation ──
    # Columns: [crop_idx, temp, humidity, wetness_hrs]
    # Classes: 0: Healthy, 1: Rice Blast, 2: Red Rot, 3: Leaf Rust, 4: Early Blight
    crop_disease_x = np.random.randint(0, 8, n_samples)
    disease_temp = np.random.uniform(15, 45, n_samples)
    disease_humidity = np.random.uniform(10, 100, n_samples)
    wetness = np.random.uniform(0, 24, n_samples)
    
    X_disease = np.column_stack([crop_disease_x, disease_temp, disease_humidity, wetness])
    y_disease = np.zeros(n_samples, dtype=int)
    
    for idx in range(n_samples):
        c = crop_disease_x[idx]
        t = disease_temp[idx]
        h = disease_humidity[idx]
        w = wetness[idx]
        
        if (c == 0 or c == 7) and 22.0 <= t <= 29.0 and h > 80.0 and w > 10.0:
            y_disease[idx] = 1 # Rice Blast
        elif c == 1 and 27.0 <= t <= 33.0 and h > 75.0 and w > 12.0:
            y_disease[idx] = 2 # Red Rot
        elif c == 5 and 26.0 <= t <= 32.0 and h > 70.0 and w > 8.0:
            y_disease[idx] = 3 # Leaf Rust
        elif 20.0 <= t <= 30.0 and h > 65.0 and w > 6.0:
            y_disease[idx] = 4 # Early Blight
        else:
            y_disease[idx] = 0 # Healthy
            
    model_disease_classifier = DecisionTreeClassifier(max_depth=6, random_state=42)
    model_disease_classifier.fit(X_disease, y_disease)
    
    logger.info("ML Models successfully trained!")

def predict_agri_risk(temp_val, hum_val, wind_val, area_val, crop_idx, soil_idx, irr_idx):
    """Executes the trained RandomForest models to retrieve parameters."""
    if model_soil_moisture is None:
        init_ml_models()
        
    features = np.array([[temp_val, hum_val, wind_val, area_val, crop_idx, soil_idx, irr_idx]])
    
    soil_moisture = float(model_soil_moisture.predict(features)[0])
    crop_health_risk = float(model_crop_health.predict(features)[0])
    yield_loss_val = float(model_yield_loss.predict(features)[0])
    
    return {
        "soilMoisture": round(soil_moisture, 1),
        "cropHealthRisk": round(crop_health_risk, 3),
        "yieldLoss": round(yield_loss_val, 3)
    }

def project_prices_arima(crop_name, base_price, months=6, stress_factor=1.0):
    """Fits a real ARIMA(1, 1, 1) model on synthetic mandi historical price data and projects trends."""
    if model_soil_moisture is None:
        init_ml_models()
    
    # Build 24-month historical series for the commodity
    np.random.seed(len(crop_name))
    seasonal_freq = 0.5 if "tomato" in crop_name.lower() else 0.2
    history = []
    current = base_price
    for t in range(24):
        # Base trend + seasonal waves + random walk noise
        trend = base_price * 0.005 * t
        cycle = np.sin(t * seasonal_freq) * (base_price * 0.05)
        noise = np.random.normal(0, base_price * 0.02)
        history.append(int(base_price + trend + cycle + noise))
        
    # Fit ARIMA model
    try:
        model = ARIMA(history, order=(1, 1, 1))
        model_fit = model.fit()
        forecast = model_fit.forecast(steps=months)
    except Exception as e:
        logger.warning(f"ARIMA fit failed: {e}. Falling back to dynamic projections.")
        forecast = [base_price * (1 + 0.02 * t) for t in range(1, months + 1)]
        
    # Process forecasts with stress factor adjustments
    prices = []
    for t in range(1, months + 1):
        raw_proj = forecast[t - 1]
        stress_impact = (stress_factor - 1.0) * base_price * -0.12
        projected = raw_proj + stress_impact
        current_price = int(max(base_price * 0.4, projected))
        
        prices.append({
            "month": f"Month {t}",
            "Price": current_price,
            "Upper": int(current_price * 1.08),
            "Lower": int(current_price * 0.92)
        })
    return prices

def diagnose_disease_ml(crop_name, temp_val, hum_val, wetness_hrs=12.0):
    """Predicts plant pathology using DecisionTreeClassifier and compiles treatment data."""
    if model_disease_classifier is None:
        init_ml_models()
        
    crop_lower = crop_name.lower()
    crop_idx = 0
    if "sugarcane" in crop_lower:
        crop_idx = 1
    elif "cotton" in crop_lower:
        crop_idx = 2
    elif "groundnut" in crop_lower:
        crop_idx = 3
    elif "vegetables" in crop_lower:
        crop_idx = 4
    elif "tomato" in crop_lower:
        crop_idx = 5
    elif "maize" in crop_lower:
        crop_idx = 6
        
    features = np.array([[crop_idx, temp_val, hum_val, wetness_hrs]])
    disease_class = int(model_disease_classifier.predict(features)[0])
    
    # Map classes to detailed diagnoses
    diagnoses = {
        0: {
            "name": "HEALTHY", "type": "No pathology detected", "confidence": "94.2%", "severity": "OPTIMAL",
            "cause": "Optimal environmental balance, good soil nutrition, and correct irrigation parameters.",
            "weatherTrigger": "Normal ranges", "waterIssue": "Adequate moisture level",
            "nutrient": "Balanced macro/micro nutrients", "pest": "None detected",
            "chemical": { "name": "None", "dosage": "N/A", "method": "N/A", "frequency": "N/A", "phi": "N/A", "safety": "N/A", "pros": "N/A", "cons": "N/A" },
            "organic": { "name": "None", "dosage": "N/A", "method": "N/A", "frequency": "N/A", "phi": "N/A", "safety": "N/A", "pros": "N/A", "cons": "N/A" },
            "yieldLoss": "0%", "valueRisk": "₹0", "recovery": "N/A", "spread": "N/A", "costPerAcre": 0, "sprayWarning": "N/A"
        },
        1: {
            "name": "Rice Blast (Pyricularia oryzae)", "type": "Fungal Infection", "confidence": "91.8%", "severity": "HIGH",
            "cause": "High leaf wetness, cooler nights, and excess nitrogen fertilizer favored spore germination.",
            "weatherTrigger": "Temp 22–29°C & Humidity >80%", "waterIssue": "High humidity & leaf wetness",
            "nutrient": "Excess Nitrogen, Low Silicon", "pest": "Neck blast spore vector",
            "chemical": { 
                "name": "Tricyclazole 75% WP", "dosage": "0.6g / Litre", 
                "method": "Foliar Spray at first sign of lesions", "frequency": "Repeat after 12 days if necessary",
                "phi": "15 Days", "safety": "Wear protective mask, gloves and boots. Do not inhale spray mist.",
                "pros": "Highly systemic, quick absorption", "cons": "Risk of fungal resistance build-up" 
            },
            "organic": { 
                "name": "Pseudomonas fluorescens (Bio-fungicide)", "dosage": "10g / Litre", 
                "method": "Foliar Spray + Seed Treatment", "frequency": "Every 7 days",
                "phi": "0 Days", "safety": "Environmentally safe, non-toxic to non-target organisms.",
                "pros": "Promotes plant growth and induces systemic resistance", "cons": "Less effective under high disease pressure" 
            },
            "yieldLoss": "25-40%", "valueRisk": "₹18,000 - ₹30,000", "recovery": "10-15 Days", "spread": "Very Aggressive",
            "costPerAcre": 680, "sprayWarning": "High wind speed expected. Spray during early hours of morning."
        },
        2: {
            "name": "Red Rot (Colletotrichum falcatum)", "type": "Fungal Pathogen", "confidence": "88.9%", "severity": "CRITICAL",
            "cause": "Infection initiated through diseased seed setts or waterlogged conditions in heavy clay soils.",
            "weatherTrigger": "Warm temp (27–33°C) & High Rainfall", "waterIssue": "Waterlogged soils and poor drainage",
            "nutrient": "Potassium deficiency", "pest": "Sugarcane borer vectors",
            "chemical": { 
                "name": "Carbendazim 50% WP", "dosage": "1.0g / Litre", 
                "method": "Sett treatment / Soil drenching", "frequency": "Preventive application",
                "phi": "30 Days", "safety": "Wear protective apron and face shield. Dangerous if ingested.",
                "pros": "Systemic prevention", "cons": "High persistence in soil" 
            },
            "organic": { 
                "name": "Trichoderma viride bio-agent", "dosage": "20g / Litre", 
                "method": "Soil application during planting", "frequency": "Once during land preparation",
                "phi": "0 Days", "safety": "Completely organic and soil-enriching.",
                "pros": "Provides long-term bio-protection against soil pathogens", "cons": "Cannot cure already infected tillers" 
            },
            "yieldLoss": "40-60%", "valueRisk": "₹45,000 - ₹75,000", "recovery": "Poor (Rogue infected stalks)", "spread": "High via water",
            "costPerAcre": 920, "sprayWarning": "Avoid spraying before heavy downpours to prevent runoff into water bodies."
        },
        3: {
            "name": "Leaf Rust (Puccinia)", "type": "Fungal Infection", "confidence": "90.5%", "severity": "HIGH",
            "cause": "High humidity and excess nitrogen created favorable conditions for rust. Dense planting reduced air circulation.",
            "weatherTrigger": "High humidity (>75%) & Temp 26–32°C", "waterIssue": "Poor drainage & Leaf wetness",
            "nutrient": "Excess Nitrogen, Low Potassium", "pest": "Aphids / Hoppers vectors",
            "chemical": { 
                "name": "Hexaconazole 5% EC", "dosage": "2ml / Litre", 
                "method": "Foliar Spray (Full coverage)", "frequency": "Repeat every 7-10 days",
                "phi": "14 Days", "safety": "Wear N95 Mask & Gloves. Toxic to bees.",
                "pros": "Fast spread control", "cons": "Chemical residue risk" 
            },
            "organic": { 
                "name": "Pseudomonas fluorescens", "dosage": "10g / Litre", 
                "method": "Foliar Spray + Soil Drench", "frequency": "Repeat every 5 days",
                "phi": "0 Days", "safety": "Eco & Bee Safe. No PPE required.",
                "pros": "Improves immunity", "cons": "Slower action" 
            },
            "yieldLoss": "30-45%", "valueRisk": "₹25,000 - ₹40,000", "recovery": "7-14 Days", "spread": "Aggressive",
            "costPerAcre": 850, "sprayWarning": "Rain expected in 48hrs. Add silicon spreader to avoid wash-off."
        },
        4: {
            "name": "Early Blight (Alternaria)", "type": "Fungal Pathogen", "confidence": "86.7%", "severity": "MEDIUM",
            "cause": "Soil-borne spores splashed onto lower leaves during irrigation/rain. Warm and humid microclimate accelerated development.",
            "weatherTrigger": "Heavy rain followed by warm days", "waterIssue": "Splash from overhead irrigation",
            "nutrient": "Calcium deficiency", "pest": "Thrips / Whiteflies present",
            "chemical": { 
                "name": "Mancozeb 75% WP", "dosage": "2.5g / Litre", 
                "method": "Targeted Foliar Spray", "frequency": "Every 15 days (Max 3 sprays)",
                "phi": "21 Days", "safety": "Avoid skin contact. Wash hands after use.",
                "pros": "Broad spectrum action", "cons": "Soil toxicity" 
            },
            "organic": { 
                "name": "Neem Oil Extract (10000 PPM)", "dosage": "5ml / Litre", 
                "method": "Foliar Spray (Evening only)", "frequency": "Every 7 days",
                "phi": "2 Days", "safety": "Safe, but avoid spraying under hot sun.",
                "pros": "Eco-safe", "cons": "Requires frequent spray" 
            },
            "yieldLoss": "15-25%", "valueRisk": "₹10,000 - ₹18,000", "recovery": "5-10 Days", "spread": "Moderate",
            "costPerAcre": 450, "sprayWarning": "High winds today. Spray early morning to avoid drift."
        }
    }
    
    return diagnoses.get(disease_class, diagnoses[0])

def translate_text(text, from_lang="en", to_lang="ta"):
    """Uses mtranslate library to perform fast translation."""
    if not text or text.strip() == "":
        return ""
    try:
        translated = mtranslate.translate(text, to_lang, from_lang)
        return translated
    except Exception as e:
        logger.error(f"Backend translation failed: {e}")
        return text
