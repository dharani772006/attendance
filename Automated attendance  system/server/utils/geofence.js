function isWithinGeofence(lat, lng, centerLat, centerLng, radiusMeters) {
  const toRad = x => x * Math.PI / 180;
  const R = 6371e3; // Earth radius in meters
  const dLat = toRad(lat - centerLat);
  const dLng = toRad(lng - centerLng);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(centerLat)) * Math.cos(toRad(lat)) *
            Math.sin(dLng/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance <= radiusMeters;
}
module.exports = isWithinGeofence;