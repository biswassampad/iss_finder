new Vue({
    el: '#app',
    data: {
        map: null,
        tileLayer: null,
        long: null,
        lat: null,
        layers: [{
            id: 0,
            name: 'Isslocation',
            active: false,
            features: [{
                id: 0,
                name: 'Bogart\'s Smokehouse',
                type: 'marker',
                coords: [this.lat, this.long],
            }, ],
        }, ],
    },
    mounted() {
        // this.getissLocation();
        this.initMap();
        this.initLayers();
    },
    methods: {
        initMap() {
            const long = null
            const lat = null
            fetch('http://api.open-notify.org/iss-now.json')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.lat = data.iss_position.latitude
                    long = data.iss_position.longitude
                });

            this.map = L.map('map').setView([lat, long], 8);
            this.tileLayer = L.tileLayer(
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                }
            );
            this.tileLayer.addTo(this.map);
        },
        initLayers() {
            this.layers.forEach((layer) => {
                // Initialize the layer
                const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
                const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
                markerFeatures.forEach((feature) => {
                    feature.leafletObject = L.marker(feature.coords)
                        .bindPopup(feature.name);
                });
                polygonFeatures.forEach((feature) => {
                    feature.leafletObject = L.polygon(feature.coords)
                        .bindPopup(feature.name);
                });
            });
        },
        layerChanged(layerId, active) {
            const layer = this.layers.find(layer => layer.id === layerId);
            layer.features.forEach((feature) => {
                /* Show or hide the feature depending on the active argument */
                if (active) {
                    feature.leafletObject.addTo(this.map);
                } else {
                    feature.leafletObject.removeFrom(this.map);
                }
            });
        },
        // getissLocation() {
        //     console.log('fetching iss location');
        //     fetch('http://api.open-notify.org/iss-now.json')
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log(data);
        //             this.lat = data.iss_position.latitude
        //             this.long = data.iss_position.longitude
        //         });
        // }
    }
});