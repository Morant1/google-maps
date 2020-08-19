console.log('Main!');

import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'





// locService.getLocs()
//     .then(locs => console.log('locs', locs));

window.onload = () => {
    mapService.initMap()
        .then(() => {

            mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
            clickMap()

        })
        .catch(console.log('INIT MAP ERROR'));

    locService.getPosition()
        .then(pos => {

            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('Cannot get user-position', err);
        })

}

// document.querySelector('.btn').addEventListener('click', (ev) => {
//     console.log('Aha!', ev.target);
//     mapService.panTo(35.6895, 139.6917);
// })

function clickMap() {
    // let userLocation = {}
    let map = mapService.getMap()
    console.log('map in controller', map);
    var myLatlng = {lat: -25.363, lng: 131.044};

    var infoWindow = new google.maps.InfoWindow(
        {content: 'Click the map to get Lat/Lng!', position: myLatlng});
    infoWindow.open(map);

    // Configure the click listener.
      map.addListener('click', function(mapsMouseEvent) {
      // Close the current InfoWindow.
      infoWindow.close();

      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({position: mapsMouseEvent.latLng});
      infoWindow.setContent(mapsMouseEvent.latLng.toString());
      infoWindow.open(map);
    //   return mapsMouseEvent.latLng
        
        let userLocationName = prompt('Enter Location Name')
        let position = mapsMouseEvent.latLng.toString()
        let newPosition = position.slice(1, position.length -1).split(',')
        // console.log('newPosition', newPosition);
        

        // userLocation.name = userLocationName;
        // userLocation.lat = +newPosition[0]
        // userLocation.lng = +newPosition[1]
        locService.createLocation(userLocationName, +newPosition[0], +newPosition[1]);
        locService.getLocs()
        .then(renderLocationTable);
        

    });
}

function renderLocationTable(locations) {
    console.log("IN")
    console.log(locations)

    var strHtmls = locations.map((location)=> {
        console.log(location)
        return `
            <ul class="location">
            <li>Location Name: ${location.name}</li>
            <li>lat: ${location.pos.lat}</li>
            <li>lng: ${location.pos.lng}</li>
            <li>Created at: ${location.createdAt}</li>
            </ul>
        
        `
    })
    console.log(strHtmls)
    document.querySelector('.locations-table').innerHTML = strHtmls.join(' ');
}



document.querySelector('.go').addEventListener('click', (ev) => {
    // console.log('Aha!', ev.target);
    console.log(ev)
    
    // mapService.panTo(35.6895, 139.6917);
})