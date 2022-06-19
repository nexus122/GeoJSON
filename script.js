// Inicializamos la variable globnal mapa
let map;
let multiplePoints = [];
// Funcion fetch que recoge los datos del geojson
async function cargarDatos() {
    let data = await fetch("./data/comarques-compressed.geojson");
    let resp = await data.json();
    console.log(resp);
    return resp;
}

//aqui montarem la tabla
function printMapData(data) {

    for (let i = 0; i < data.features.length; i++) {
        // Array de coordenadas          
        let comarca = data.features[i].properties.nom_comar;
        let cap_comar = data.features[i].properties.cap_comar;
        let id_comarca = data.features[i].properties.comarca;
        let coords = data.features[i].geometry.coordinates[0];
        let points = [];
        coords.forEach(coord => {            
            coord.forEach(latLeng => {                
                points.push(new google.maps.LatLng(latLeng[1], latLeng[0]));
            })
            multiplePoints.push({points: points, comarca: comarca, capital: cap_comar, id_comarca: id_comarca});
        });                        
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.83818476331067, lng: 1.5400597288349847 },
        zoom: 13,
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
            //strokeColor: '#FF0000',
            //strokeOpacity: 0.8,
            //strokeWeight: 2,
            //fillColor: '#FF0000',
            //fillOpacity: 0.35
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

iniciar();
