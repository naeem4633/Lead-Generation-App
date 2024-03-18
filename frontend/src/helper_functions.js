// Function to calculate new latitude given initial latitude, longitude, and distance (in meters) moving north
function calculateLatitudeNorth(lat, lon, distance) {
    const deltaLat = distance / 111320; // Approximate 1 degree latitude distance in meters
    return roundTo4Decimal(lat + deltaLat);
}

// Function to calculate new latitude given initial latitude, longitude, and distance (in meters) moving south
function calculateLatitudeSouth(lat, lon, distance) {
    const deltaLat = -distance / 111320; // Approximate 1 degree latitude distance in meters
    return roundTo4Decimal(lat + deltaLat);
}

// Function to calculate new longitude given initial latitude, longitude, and distance (in meters) moving east
function calculateLongitudeEast(lat, lon, distance) {
    const deltaLon = distance / (111320 * Math.cos((lat * Math.PI) / 180)); // Approximate 1 degree longitude distance in meters
    return roundTo4Decimal(lon + deltaLon);
}

// Function to calculate new longitude given initial latitude, longitude, and distance (in meters) moving west
function calculateLongitudeWest(lat, lon, distance) {
    const deltaLon = -distance / (111320 * Math.cos((lat * Math.PI) / 180)); // Approximate 1 degree longitude distance in meters
    return roundTo4Decimal(lon + deltaLon);
}

// Function to calculate new latitude given initial latitude, longitude, and distance (in meters) moving northeast
function calculateLatitudeNortheast(lat, lon, distance) {
    const deltaLat = distance / (2 * 111320); // Approximately half of the distance for both latitude and longitude
    return roundTo4Decimal(lat + deltaLat);
}

// Function to calculate new latitude given initial latitude, longitude, and distance (in meters) moving northwest
function calculateLatitudeNorthwest(lat, lon, distance) {
    const deltaLat = distance / (2 * 111320); // Approximately half of the distance for both latitude and longitude
    return roundTo4Decimal(lat + deltaLat);
}

// Function to calculate new latitude given initial latitude, longitude, and distance (in meters) moving southeast
function calculateLatitudeSoutheast(lat, lon, distance) {
    const deltaLat = -distance / (2 * 111320); // Approximately half of the distance for both latitude and longitude
    return roundTo4Decimal(lat + deltaLat);
}

// Function to calculate new latitude given initial latitude, longitude, and distance (in meters) moving southwest
function calculateLatitudeSouthwest(lat, lon, distance) {
    const deltaLat = -distance / (2 * 111320); // Approximately half of the distance for both latitude and longitude
    return roundTo4Decimal(lat + deltaLat);
}

// Function to round a number to 4 decimal places
function roundTo4Decimal(num) {
    return Math.round((num + Number.EPSILON) * 10000) / 10000;
}

// Function to calculate new latitude and longitude given initial latitude, longitude, direction, and distance (in meters)
function calculateNewPosition(lat, lon, direction, distance) {
    if (direction === 'north') {
        return [calculateLatitudeNorth(lat, lon, distance), lon];
    } else if (direction === 'south') {
        return [calculateLatitudeSouth(lat, lon, distance), lon];
    } else if (direction === 'east') {
        return [lat, calculateLongitudeEast(lat, lon, distance)];
    } else if (direction === 'west') {
        return [lat, calculateLongitudeWest(lat, lon, distance)];
    } else if (direction === 'northeast') {
        return [calculateLatitudeNortheast(lat, lon, distance), calculateLongitudeEast(lat, lon, distance)];
    } else if (direction === 'northwest') {
        return [calculateLatitudeNorthwest(lat, lon, distance), calculateLongitudeWest(lat, lon, distance)];
    } else if (direction === 'southeast') {
        return [calculateLatitudeSoutheast(lat, lon, distance), calculateLongitudeEast(lat, lon, distance)];
    } else if (direction === 'southwest') {
        return [calculateLatitudeSouthwest(lat, lon, distance), calculateLongitudeWest(lat, lon, distance)];
    } else {
        throw new Error('Invalid direction');
    }
}

// Function to calculate new latitude and longitude given initial latitude, longitude, direction, distance (in meters), and a factor
function calculateNewPositionWithFactor(lat, lon, direction, distance, factor) {
    const modifiedDistance = distance * factor;
    return calculateNewPosition(lat, lon, direction, modifiedDistance);
}

module.exports = calculateNewPositionWithFactor
