var gId = 101
const key = 'locations'

export const locService = {
    getLocs,
    getPosition,
    createLocation
}
var locs = []

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

document.querySelector('.my-location-btn').onclick = () => {
    locService.getPosition()
    .then(pos => {
        mapService.panTo(pos.coords.latitude , pos.coords.longitude)
    }) 
    .catch(err => {
        console.log('Cannot get user location', err);
    })
}

function getPosition() { //user position
    console.log('Getting Pos');

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function createLocation(name, lat, lng) {
        let location = {
            id: gId++,
            name,
            pos: {lat, lng},
            createdAt: new Date().toLocaleString()
        }
        locs.push(location)
        saveLocations(locs)

}

function saveLocations(val) {
    saveToStorage(val)
}


function saveToStorage(val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage() {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}
