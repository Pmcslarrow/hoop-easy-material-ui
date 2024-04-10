function convertToLocalTime( storedUtcDateTime ) {
    const userLocalDateTime = new Date(storedUtcDateTime);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userDateTimeString = userLocalDateTime.toLocaleString('en-US', { timeZone: userTimeZone });
    return userDateTimeString
}

function extractDateTime(datetime) {
    const split = datetime.split(',')
    return { date: split[0], time: split[1] }
}

async function sortGamesByLocationDistance (games) {
    const userCoordinates = await getUserCoordinates();
    const { latitude: userLat, longitude: userLon } = userCoordinates;
    const sortedGames = games.sort((game1, game2) => {
        const distance1 = getDistanceFromLatLonInMiles(userLat, userLon, game1.latitude, game1.longitude);
        const distance2 = getDistanceFromLatLonInMiles(userLat, userLon, game2.latitude, game2.longitude);
        return distance1 - distance2;
    });
    
    sortedGames.forEach((game) => {
        game.distance = getDistanceFromLatLonInMiles(userLat, userLon, game.latitude, game.longitude);
        game.time = convertToLocalTime(game.dateOfGameInUTC);
    });
    
    return sortedGames;
};

export default function getUserCoordinates() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                   resolve({
                       latitude: position.coords.latitude,
                       longitude: position.coords.longitude
                   });
                },
                (error) => {
                   reject(error);
                }
            );
        } else {
            reject('Geolocation is not supported by this browser.');
        }
    });
 }

function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    var dInMiles = d * 0.621371; // Convert to miles
    return dInMiles;
 }
 
 function deg2rad(deg) {
    return deg * (Math.PI/180)
 }

export { convertToLocalTime, extractDateTime, sortGamesByLocationDistance }