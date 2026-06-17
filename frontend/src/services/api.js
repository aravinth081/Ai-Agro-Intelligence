 // src/services/api.js
export const fetchAllLiveData = async (location) => {
  const weatherData = {
    location: location || "Coimbatore",
    temp: "31°C",
    humidity: "65%",
    wind: "12 km/h"
  };

  const marketRates = [
    { crop: "Paddy", price: "₹2,100 / Qtl", profitRange: "15% - 20%", lossRange: "2% - 5%", stockLevel: "High", marketStatus: "Stable" },
    { crop: "Wheat", price: "₹2,275 / Qtl", profitRange: "10% - 15%", lossRange: "1% - 3%", stockLevel: "High", marketStatus: "Steady" },
    { crop: "Cotton", price: "₹7,500 / Qtl", profitRange: "25% - 35%", lossRange: "8% - 12%", stockLevel: "Medium", marketStatus: "Volatile" },
    { crop: "Sugarcane", price: "₹3,200 / Ton", profitRange: "8% - 12%", lossRange: "0% - 2%", stockLevel: "Very High", marketStatus: "Stable" },
    { crop: "Tomato", price: "₹45 / Kg", profitRange: "40% - 60%", lossRange: "30% - 50%", stockLevel: "Low", marketStatus: "High Risk" },
    { crop: "Onion", price: "₹30 / Kg", profitRange: "20% - 25%", lossRange: "2% - 5%", stockLevel: "Medium", marketStatus: "Bullish" },
    { crop: "Chilli", price: "₹18,000 / Qtl", profitRange: "30% - 40%", lossRange: "15% - 20%", stockLevel: "Low", marketStatus: "Bullish" }
  ];

  return { weather: weatherData, marketRates };
};