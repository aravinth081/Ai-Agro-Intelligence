from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
from ml_engine import init_ml_models, predict_agri_risk, project_prices_arima, diagnose_disease_ml, translate_text
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Define ML Pydantic Models
class PredictRiskInput(BaseModel):
    temp: float
    humidity: float
    wind: float
    area: float
    crop_idx: int
    soil_idx: int
    irr_idx: int

class ForecastPricesInput(BaseModel):
    crop_name: str
    base_price: int
    months: int = 6
    stress_factor: float = 1.0

class DiagnoseDiseaseInput(BaseModel):
    crop_name: str
    temp: float
    humidity: float
    wetness_hrs: float = 12.0

class TranslateInput(BaseModel):
    text: str
    from_lang: str = "en"
    to_lang: str = "ta"

# ML Endpoints
@api_router.post("/ml/predict-risk")
async def api_predict_risk(input: PredictRiskInput):
    return predict_agri_risk(
        input.temp, input.humidity, input.wind, input.area,
        input.crop_idx, input.soil_idx, input.irr_idx
    )

@api_router.post("/ml/forecast-prices")
async def api_forecast_prices(input: ForecastPricesInput):
    return project_prices_arima(input.crop_name, input.base_price, input.months, input.stress_factor)

@api_router.post("/ml/diagnose-disease")
async def api_diagnose_disease(input: DiagnoseDiseaseInput):
    return diagnose_disease_ml(input.crop_name, input.temp, input.humidity, input.wetness_hrs)

@api_router.post("/ml/translate")
async def api_translate(input: TranslateInput):
    translated_text = translate_text(input.text, input.from_lang, input.to_lang)
    return {"translatedText": translated_text}

# Startup Event to initialize and train ML models
@app.on_event("startup")
async def startup_event():
    init_ml_models()

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()