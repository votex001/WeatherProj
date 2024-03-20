
export const mapService = {
    initMap,
    searchAdress,
    setMarker,
    panTo,
    setZoom
}

let map


const API_KEY = 'AIzaSyC2OIT2dYuL2lYrn1kASqnKh_b93hBPZEs' //TODO: Enter your API Key


function initMap(lat, lng, zoom = 15) {
    return _connectGoogleApi()
    .then(() => {
        map = new google.maps.Map(document.getElementById("map"), {
            center: {lat,  lng},
            zoom: zoom,
        });
        map.addListener('click', e => {
            // console.log(e)
            
            setMarker(e.latLng.lat(),e.latLng.lng())
            panTo(e.latLng.lat(),e.latLng.lng())
        })
        return map
    })
}




function searchAdress(address) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='
    const params = `${address}&key=${API_KEY}&language=en`
    
    return fetch(url + params)
    .then(response => response.json())
    .then(res => res.results[0])
    .then(data => {
        console.log(data)
        if (!data) return
        return {
            pos: {
                lat: data.geometry.location.lat,
                lng: data.geometry.location.lng
            },
            title:address.charAt(0).toUpperCase() + address.slice(1),
            address: data.formatted_address
        }
    })
    }
    
    
    
    function setMarker(lat,lng,title = "Point") {
        // google.maps.marker.AdvancedMarkerElement not working
        let marker = new google.maps.Marker({
            position:{lat,lng},
            map: map,
            title,
        })
        marker.addListener('click',()=>{
            marker.setMap(null)
    })
        return marker
    }
    
    function panTo(lat,lng){
        var laLatLng = new google.maps.LatLng(lat, lng)
        map.panTo(laLatLng)
        
    }
    
    
    
    
    
    
    function _connectGoogleApi() {
        if (window.google) return Promise.resolve()
        const elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true;
    elGoogleApi.defer = true;
    document.head.append(elGoogleApi)
    
    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function setZoom(num=12){
    map.setZoom(num)
}

