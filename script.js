// Inicializamos la variable globnal mapa
let map;
let points; 
// Funcion fetch que recoge los datos del geojson
async function cargarDatos() {
    let data = await fetch("./data/comarques-compressed.geojson");
    let resp = await data.json();    
    console.log(resp.features[0]);
    return resp.features[0];
}

//aqui montarem la tabla
function printMapData(data) {

        // Array de coordenadas        
        //let comarques = data.properties.nom_comar;
        let coords = data.geometry.coordinates[0];
        points = [];

        let largo = coords[0].length;
        for (let i = 0; i < largo; i++) {
            points.push(new google.maps.LatLng(coords[0][i][1],coords[0][i][0]));
        }

        drawInMap(points);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.479211, lng: 1.475005 },
        zoom: 13,
    });
    
    /*new google.maps.Marker({
        position: { lat: 41.479211, lng: 1.475005 },
        map: map,
    });*/        
    
    drawInMap(points);
}

function drawInMap(arr_coords){
    let line = new google.maps.Polyline({ map: map, path: arr_coords, strokeColor: "red", strokeWeight: 6, strokeOpacity: 1 });
    line.setMap(map);
}

async function iniciar() {
    let datos = await cargarDatos();
    printMapData(datos);
    initMap();
}

iniciar();
