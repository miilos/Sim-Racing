const propertiesMap = new Map();
propertiesMap.set('sports_car', { maxSpeed: 140, malfunctionChance: 12, class: 'car' });
propertiesMap.set('terrain_car', { maxSpeed: 100, malfunctionChance: 3, class: 'car' });
propertiesMap.set('cross_bike', { maxSpeed: 85, malfunctionChance: 3, class: 'bike' });
propertiesMap.set('sports_bike', { maxSpeed: 130, malfunctionChance: 18, class: 'bike' });
propertiesMap.set('truck', { maxSpeed: 80, malfunctionChance: 6, class: 'truck' });

exports.appendToRequest = request => {
    if(request.vehicleType === 'n/a')
        throw new Error();
    
    // Map the vehicle type from the select to prperties the user doesn't have to set himself,
    // append that to the request body, and send it back so a document can be created based on that

    const appendProperties = propertiesMap.get(request.vehicleType);
    const vehicle = Object.assign(request, appendProperties);
    return vehicle;
}

exports.propertiesMap = propertiesMap;