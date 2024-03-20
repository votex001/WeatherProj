import { mapService } from "./js_modules/map.js"
import { weatherService } from "./js_modules/weather.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
window.onInit = onInit
window.myGeo = myGeo
window.copy = copy
window.del = del
const input = document.querySelector('#search-box')
const searchBtn = document.querySelector('#search-btn')
const userGeo = new Promise((resolve, reject) => { navigator.geolocation.getCurrentPosition(resolve, reject) })
const saveKey = "YourHistory"
const LS =localStorage
let defaultPage = true;

if (window.location.search.includes('lat') && window.location.search.includes('lng')) {
    defaultPage = false
}



function onInit() {
    if (defaultPage) {
        userGeo.then(res => {
            mapService.initMap(res.coords.latitude, res.coords.longitude)
                .then(res => res.addListener('click', e => {
                    weatherService.getWeather(e.latLng.lat(), e.latLng.lng())
                }))
        })
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const lat = urlParams.get('lat');
        const lng = urlParams.get("lng")
        mapService.initMap(+lat, +lng)
            .then(res =>
                res.addListener('click', e => {
                    weatherService.getWeather(e.latLng.lat(), e.latLng.lng())
                }))
        weatherService.getWeather(+lat, +lng)
    }


}

function myGeo() {
    userGeo.then(res => { mapService.panTo(res.coords.latitude, res.coords.longitude), mapService.setMarker(res.coords.latitude, res.coords.longitude, "Your Geo") })
    mapService.setZoom(15)
}






searchBtn.addEventListener('click', e => {
    if (input.value.length) {
        mapService.searchAdress(input.value).then(
            res => {
                const url = window.location.origin + "?lat=" + res.pos.lat + "&lng=" + res.pos.lng
                // console.log(window.location)
                const id =uuidv4()
                document.querySelector(".history").innerHTML += `
                <div id="${id}">
                    <p>${res.address}</p>
                    <div>
                    <button onclick="del('${id}')">Delete</button>
                        <button onclick="copy('${url}')">Copy Link</button>
                        </div>
                        </div>`
                LS.setItem(saveKey,JSON.stringify(document.querySelector(".history").innerHTML))
                weatherService.getWeather(res.pos.lat, res.pos.lng)
                mapService.panTo(res.pos.lat, res.pos.lng, 12)
                mapService.setMarker(res.pos.lat, res.pos.lng, res.title)
            }
        )
    }

})
function del(id){
    document.getElementById(`${id}`).remove()
    LS.setItem(saveKey,JSON.stringify(document.querySelector(".history").innerHTML))
}


async function copy(value) {
    try {
        const blob = new Blob([value], { type: 'text/plain' });
        const clipboardItem = new ClipboardItem({
            'text/plain': blob
        });


        await navigator.clipboard.write([clipboardItem]);

    } catch (err) {

        console.log(err.message);
    }
}





if(LS.getItem(saveKey)){
    document.querySelector(".history").innerHTML = JSON.parse(LS.getItem(saveKey))
}


