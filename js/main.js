console.log('Main!');

import {
    locService
} from './services/loc.service.js'
import {
    mapService
} from './services/map.service.js'
var gLinkPos = {}
let defLat;
let defLng;



window.onload = () => {
   decodeURI(window.location.search)
        .replace('?', '&')
        .split('&')
        .map(param => param.split('='))
        .reduce((values, [key, value]) => {
            values[key] = value
            if (key === 'lat') defLat = values[key]
            if (key === 'lng') defLng = values[key]
            return values
        }, {})

    mapService.initMap(+defLat, +defLng)
        .then(() => {

            mapService.addMarker({
                lat: mapService.getMap().center.lat(),
                lng: mapService.getMap().center.lng()
            });
            clickMap()


        })
        .catch(err => console.log(err,'INIT MAP ERROR'));

    locService.getPosition()
        .then(pos => {

            console.log('User position is: lat', pos.coords.latitude, 'lng', pos.coords.longitude);
        })
        .catch(err => {
            console.log('Cannot get user-position', err);
        })

    document.querySelector('.go').onclick = () => {
        var userInput = document.querySelector('.input-user').value;
        console.log('userInput', userInput);

        mapService.getGeoCodeLocation(userInput)
            .then(data => {
                let lat = data.results[0].geometry.location.lat
                let lng = data.results[0].geometry.location.lng
                locService.createLocation(userInput, lat, lng)
                mapService.panTo(lat, lng)
                let position = {
                    lat,
                    lng
                }
                gLinkPos = position;
                mapService.addMarker(position)
                locService.getLocs()
                    .then(renderLocationTable);
            })
            .catch(err => console.log('err', err))

    }

    function copy() {
        var userInput = document.querySelector('.input-user');

        userInput.value = `https://morant1.github.io/travel-tip/index.html?lat=${gLinkPos.lat}&lng=${gLinkPos.lng}`
        userInput.select();
        document.execCommand("copy");
        userInput.value = ''
    }

    document.querySelector(".copy-link-btn").addEventListener("click", copy);
}

function clickMap() {
    // let userLocation = {}
    let map = mapService.getMap()
    var myLatlng = {
        lat: -25.363,
        lng: 131.044
    };

    var infoWindow = new google.maps.InfoWindow({
        content: 'Click the map to get Lat/Lng!',
        position: myLatlng
    });
    infoWindow.open(map);

    // Configure the click listener.
    map.addListener('click', function (mapsMouseEvent) {
        // Close the current InfoWindow.
        infoWindow.close();

        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng
        });
        infoWindow.setContent(mapsMouseEvent.latLng.toString());
        infoWindow.open(map);
        //   return mapsMouseEvent.latLng

        let userLocationName = prompt('Enter Location Name')
        let position = mapsMouseEvent.latLng.toString()
        // console.log(mapsMouseEvent.latLng.lat())
        let newPosition = position.slice(1, position.length - 1).split(',')
        locService.createLocation(userLocationName, +newPosition[0], +newPosition[1]);
        locService.getLocs()
            .then(renderLocationTable);


    });
}

function renderLocationTable(locations) {

    var strHtmls = locations.map((location) => {

        return `
            <ul class="location">
            <li>Location Name: ${location.name}</li>
            <li>lat: ${location.pos.lat}</li>
            <li>lng: ${location.pos.lng}</li>
            <li>Created at: ${location.createdAt}</li>
            <li><button data-id=${location.id} class="location-go">GO</button></li>
            <li><button data-id=${location.id} class="location-delete">DELETE</button></li>
            </ul>
        
        `

    })
    document.querySelector('.locations-table').innerHTML = strHtmls.join(' ');
    putClicks();



}


function putClicks() {
    let buttonsGo = document.querySelectorAll('.location-go');
    locService.getLocs()
        .then(locs => {
            buttonsGo.forEach(button => {
                button.onclick = () => {
                    var loc = locs.find(location => {
                        return location.id === +button.dataset.id
                    })
                    mapService.panTo(loc.pos.lat, loc.pos.lng)
                    let position = {
                        lat: loc.pos.lat,
                        lng: loc.pos.lng
                    }
                    mapService.addMarker(position)


                }

            })

        });


    let buttons = document.querySelectorAll('.location-delete');
    buttons.forEach((button) => {
        button.onclick = () => {
            let id = button.dataset.id;
            locService.removeLocation(+id)
                .then(data => {
                    renderLocationTable(data)
                })
        };
    })
}



// document.querySelector('.delete').onclick = () => {
//     locService.removeLocation()
//         .then(data => {
//             renderLocationTable(locService.getLocs())
//         })
// }






// function checkInput(locs, user) {
//     var idx = locs.findIndex(loc => loc.name === user)
//     if (idx !== -1) {
//         mapService.panTo(locs[idx].pos.lat, locs[idx].pos.lng)
//         let position = {
//             lat: locs[idx].pos.lat,
//             lng: locs[idx].pos.lng
//         }
//         console.log(position)
//         mapService.addMarker(position)
//     }
// }




document.querySelector('.my-location').onclick = () => {
    locService.getPosition()
        .then(pos => {
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            let position = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }
            mapService.addMarker(position)
        })

        .catch(err => {
            console.log('Cannot get user location', err);
        })
}

// document.querySelector('.copy-link-btn').onclick = () => {


//     copyText.select()
//     document.execCommand("copy")
// }