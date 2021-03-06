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
            fetch('http://api.open-notify.org/iss-now.json')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const lat = data.iss_position.latitude
                    const long = data.iss_position.longitude
                    this.map = L.map('map').setView([lat, long], 3);
                    this.tileLayer = L.tileLayer(
                        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png', {
                            maxZoom: 18,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; ISS Finder',
                        }
                    );
                    this.tileLayer.addTo(this.map);
                    this.lat = lat;
                    this.long = long;
                });


        },
        initLayers() {
            this.layers.forEach((layer) => {
                // Initialize the layer
                const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
                const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
                fetch('http://api.open-notify.org/iss-now.json')
                    .then(response => response.json())
                    .then(data => {
                        const lat = data.iss_position.latitude
                        const long = data.iss_position.longitude
                        let cords = []
                        cords.push(lat)
                        cords.push(long)
                        markerFeatures.forEach((feature) => {
                            feature.leafletObject = L.marker(cords)
                                .bindPopup(feature.name);
                        });
                        polygonFeatures.forEach((feature) => {
                            feature.leafletObject = L.polygon(cords)
                                .bindPopup(feature.name);
                        });
                    })
                    .catch(err => {
                        console.log("Error while fetching the exact location", err)
                    })

            });
        },

        layerChanged(layerId, active) {
            console.log('thisMap', this.map)
            console.log('layer id', layerId)
            console.log('active', active)
            const layer = this.layers.find(layer => layer.id === layerId);
            layer.features.forEach((feature) => {
                /* Show or hide the feature depending on the active argument */
                if (active) {
                    feature.leafletObject.addTo(this.map);
                } else {
                    feature.leafletObject.removeFrom(this.map);
                }
            });
        }
    }
});