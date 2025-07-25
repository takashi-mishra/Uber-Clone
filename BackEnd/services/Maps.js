const axios = require('axios');
const CaptionModel = require('../models/CaptinModel');

module.exports.getAddressCoordinates = async (address) => {
  const apiKey = process.env.MAPS_API_KEY;
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}&size=1`;
  try {
    const response = await axios.get(url);
    const coordinates = response.data.features[0]?.geometry.coordinates;
    if (coordinates) return { lon: coordinates[0], lat: coordinates[1] };
    else throw new Error('No coordinates found');
  } catch (error) {
    console.error('Geocoding Error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports.getCaptionsInTheRadius = async (lat, lon, radius) => {
  return await CaptionModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lon, lat], radius / 6378.1] // [lon, lat]
      }
    }
  });
};

module.exports.getDistances = async (origin, destination) => {
  const apiKey = process.env.MAPS_API_KEY;
  try {
    const originCoords = await module.exports.getAddressCoordinates(origin);
    const destCoords = await module.exports.getAddressCoordinates(destination);
    const body = {
      coordinates: [
        [originCoords.lon, originCoords.lat],
        [destCoords.lon, destCoords.lat]
      ]
    };
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const response = await axios.post(url, body, {
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });
    const summary = response.data.routes[0]?.summary;
    if (summary) {
      return {
        distance: `${(summary.distance / 1000).toFixed(2)} km`,
        duration: `${Math.ceil(summary.duration / 60)} mins`
      };
    } else {
      throw new Error('No route summary found');
    }
  } catch (error) {
    console.error('[Get Distance] Error:', error.response?.data || error.message);
    throw new Error('Error fetching distance');
  }
};

module.exports.getAutoSuggestions = async (input) => {
  const apiKey = process.env.MAPS_API_KEY;
  const url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(input)}&size=5`;
  try {
    const response = await axios.get(url);
    return response.data.features.map((feature) => feature.properties.label);
  } catch (error) {
    console.error('Autocomplete error:', error);
    throw error;
  }
};