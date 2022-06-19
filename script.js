// Iniciamos variables globales.
let map;
let multiplePoints = [];
let geojson = "./data/comarques-compressed.geojson"

// Funcion fetch que recoge los datos del geojson
async function cargarDatos() {
    let data = await fetch(geojson);
    let resp = await data.json();
    console.log(resp);
    return resp;
}

// Funcion que recoge los datos del geojson y los muestra en el mapa
function printMapData(data) {
    // Recorremos el array de datos
    for (let i = 0; i < data.features.length; i++) {
        
        // Obtenemos los datos para el panel de información
        let comarca = data.features[i].properties.nom_comar;
        let cap_comar = data.features[i].properties.cap_comar;
        let id_comarca = data.features[i].properties.comarca;

        // Obtenemos los puntos de la comarca
        let coords = data.features[i].geometry.coordinates[0];
        let points = [];

        // Recorremos los puntos de la comarca
        coords.forEach(coord => {            
            coord.forEach(latLeng => {
                // Creamos un objeto con los datos de la comarca
                points.push(new google.maps.LatLng(latLeng[1], latLeng[0]));
            })
            
            // Introducimos los datos en el json de comarcas.
            multiplePoints.push({points: points, comarca: comarca, capital: cap_comar, id_comarca: id_comarca});
        });                        
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.83818476331067, lng: 1.5400597288349847 },
        zoom: 8,
    });

    infoWindow = new google.maps.InfoWindow;

        function showArrays(event) {
            var vertices = this.getPath();
            infoWindow.setContent(this.content);
            infoWindow.setPosition(event.latLng);
            infoWindow.open(map);
        }

    multiplePoints.forEach(arr_coords => {
        let polygon = new google.maps.Polygon({
            paths: arr_coords.points,
            strokeColor: 'black',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: 'white',
            fillOpacity: 0.35,
            content: `Comarca: ${arr_coords.comarca}<br>Capital: ${arr_coords.capital}<br>Id: ${arr_coords.id_comarca}`
        });
        polygon.setMap(map);
        polygon.addListener('click', showArrays);
    });
   
}

function drawInMap(arr_coords){
    let line = new google.maps.Polyline({ map: map, path: arr_coords, strokeColor: "red", strokeWeight: 6, strokeOpacity: 0.5 });
    line.setMap(map);
}

async function iniciar() {
    let datos = await cargarDatos();
    printMapData(datos);
    initMap();
}

document.querySelector(".dibujar").addEventListener("click", function(){
    let selected = document.querySelector(".geojsonSelector").value;
    geojson = `./data/${selected}`;
    multiplePoints = [];
    iniciar();
});

iniciar();
