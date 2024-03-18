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

// Function to round a number to 4 decimal places
function roundTo4Decimal(num) {
    return Math.round((num + Number.EPSILON) * 10000) / 10000;
}

// Function to calculate new latitude and longitude given initial latitude, longitude, direction (north, south, east, west), and distance (in meters)
function calculateNewPosition(lat, lon, direction, distance) {
    if (direction === 'north') {
        return [calculateLatitudeNorth(lat, lon, distance), lon];
    } else if (direction === 'south') {
        return [calculateLatitudeSouth(lat, lon, distance), lon];
    } else if (direction === 'east') {
        return [lat, calculateLongitudeEast(lat, lon, distance)];
    } else if (direction === 'west') {
        return [lat, calculateLongitudeWest(lat, lon, distance)];
    } else {
        throw new Error('Invalid direction');
    }
}

// Function to calculate new latitude and longitude given initial latitude, longitude, direction (north, south, east, west), distance (in meters), and a factor
function calculateNewPositionWithFactor(lat, lon, direction, distance, factor) {
    const modifiedDistance = distance * factor;
    return calculateNewPosition(lat, lon, direction, modifiedDistance);
}


console.log(calculateNewPositionWithFactor(42.3501, -71.0712, 'north', 1000, 1.5));