var map = null;

function filterNeighborhoods() {
    
    const neighboorhoods = [...new Set(buildings.map(b => b.Colonia))].sort();

    neighboorhoods.forEach(n => {
        let o = new Option(n, n);
        /// jquerify the DOM object 'o' so we can use the html method
        $(o).html(n);
        $('#colonias-select').append(o);
    });
    
}

function filterStreets(neighboorhood) {
    
    const streets = [...new Set(buildings.filter(b => b.Colonia == neighboorhood).map(b => b.Calle))].sort();

    streets.forEach(s => {
        let o = new Option(s, s);
        $(o).html(s);
        $('#calles-select').append(o);
    });
    
}

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWJyYXZvOTIxIiwiYSI6ImNqcG10MjBzcDBzZTczeHA1Njltd2o4MGMifQ.Ey4FPNa9j5C4X8UODu_7gw';
			
	map = new mapboxgl.Map({
				container: 'map',
				style: 'mapbox://styles/abravo921/cjpmtrfa126e92sml6bp1z2br'
			});
    map.on('load', function () {
        map.addSource('ao-buildings-src', {
            type: 'geojson',
            data: {
              "type": "FeatureCollection",
              "features": []
            }
        });

        map.addLayer({
            "id": "ao-buildings",
            "type": "symbol",
            "source": 'ao-buildings-src',
            "layout": {
                "icon-image": "star-15",
                "icon-allow-overlap": true,
                "icon-size": 1.3,
                "text-field": "",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });

        map.on('click', 'ao-buildings', e => {
            const building_id = e.features[0].properties.id;
            const info = buildings.find(b => b.id == building_id);
            
            const t = `<tr><td>Fecha de denuncia</td><td>${info['Fecha de denuncia ']}</td></tr>`
                    + `<tr><td>Uso de Suelo</td><td>${info['Uso de Suelo']}</td></tr>`
                    + `<tr><td>Niveles de construcción permitidos</td><td>${info['Niveles de construcción permitidos ']}</td></tr>`
                    + `<tr><td>Superficie máxima de construcción m<sup>2</sup></td><td>${info['Superficie máxima de construcción m2']}</td></tr>`
                    + `<tr><td>Número de Niveles de Construcción</td><td>${info['Número de niveles de la construcción']}</td></tr>`
                    + `<tr><td>Número de viviendas</td><td>${info['Número de viviendas']}</td></tr>`
                    + `<tr><td>Superficie m<sup>2</sup></td><td>${info['Superficie m2']}</td></tr>`
                    + `<tr><td>Número de árboles talados</td><td>${info['Número de árboles talados ']}</td></tr>`
                    + `<tr><td>Fusión de Predios</td><td>${info['Fusión de Predios']}</td></tr>`
                    + `<tr><td>Afectaciones Ambientales/Barrancas</td><td>${info['Afectaciones Ambientales/Barrancas']}</td></tr>`
                    + `<tr><td>Especificaciones</td><td>${info['Especificaciones ']}</td></tr>`
                    + `<tr><td>Población Aproximada</td><td>${info['Población aproximada']}</td></tr>`
                    + `<tr><td>Litros aproximados de agua por año</td><td>${info['Litros de agua ']}</td></tr>`
                    + `<tr><td>Número aproximado de autos</td><td>${info['Número de autos por construcción ']}</td></tr>`;

            $('#info-table tbody').html(t);

            $('#info-modal .modal-footer p').text(`${info.Calle} ${info.Número}, ${info.Colonia}.`);

            $('#info-modal').modal('show');
        });
    });
   
}

function placeBuildings(neighboorhood, street) {
    let b = buildings.filter(b => b.Colonia == neighboorhood && b.Calle == street)
            .map(b => {
                const lng = b.Longitud ? Number(b.Longitud) : -99.1269;
                const lat = b.Latitud ? Number(b.Latitud) : 19.4978;
                return {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "properties": {
                        "id": b.id
                    }
                }
            });
 
    map.getSource('ao-buildings-src').setData({
        "type": "FeatureCollection",
        "features": b
    });
 
}

$(function(){ 
    initMap();
    filterNeighborhoods();
    $('#colonias-select').on('change',function() {
        map.getSource('ao-buildings-src').setData({
            "type": "FeatureCollection",
            "features": []
        });
        $('#calles-select').empty().html('<option selected value="default">Selecciona una opción</option>');
        filterStreets(this.value);
    });

    $('#calles-select').on('change',function() {
        const n = $('#colonias-select').val();
        placeBuildings(n,this.value);
    });

});