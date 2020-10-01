import React from 'react'
import { setSelect } from '../redux/action-creators'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { connect } from 'react-redux'

const turf = window.turf;
mapboxgl.accessToken = 'pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q'

let Map = class Map extends React.Component {
  mapRef = React.createRef();
  map;

  static propTypes = {
    data: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired,

  };

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/xmzhu/ckbqk0jmp4o041ipd7wkb39fw',
      center: [138.7, -34.9],
      zoom: 9
    });

    var hoveredSA2Id = null;
    var clickedSA2 = null;
    var clickedFeatures = []

    this.map.on('load', () => {
      /*this.map.addSource('countries', {
        type: 'geojson',
        data: this.props.data
      });

      this.map.addLayer({
        id: 'countries',
        type: 'fill',
        source: 'countries'
      }, 'country-label-lg'); // ID metches `mapbox/streets-v9`
      */
      
      this.map.addSource('sa2', {
        type: 'geojson',
        data: this.props.data
      });

      this.map.addLayer({
        'id': 'sa2-fills',
        'type': 'fill',
        'source': 'sa2',
        'sourceLayer': 'original',
        'layout': {},
        'paint': {
          'fill-color': /*['case',
          ['boolean', ['feature-state', 'click'], false],
          '#696969',

          ]*/
          {
            property: 'income_diversity',
            stops: [[0.1024, '#fdedc4'], [0.66, '#f09647'], [1.2168, '#dd4b27']]
            },
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            1,
            ['boolean', ['feature-state', 'highlight'], false],
            1,
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.8
          ]
        }
      });
       
      this.map.addLayer({
        'id': 'sa2-borders',
        'type': 'line',
        'source': 'sa2',
        'sourceLayer': 'original',
        'layout': {},
        'paint': {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            '#000080', 
            ['boolean', ['feature-state', 'highlight'], false],
            '#008000', 
            ['boolean', ['feature-state', 'hover'], false],
            '#fef4e1', 
            '#fef4e1'
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            2, 
            ['boolean', ['feature-state', 'highlight'], false],
            2,
            ['boolean', ['feature-state', 'hover'], false],
            2, 
            0.75
          ],
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            1.5,
            ['boolean', ['feature-state', 'highlight'], false],
            1.5,
            ['boolean', ['feature-state', 'hover'], false],
            1.5,
            0.5
          ]
        }
      });

      // When the user moves their mouse over the sa2-fill layer, we'll update the
      // feature state for the feature under the mouse.
      this.map.on('mousemove', 'sa2-fills', (e) => {
        if (e.features.length > 0) {
          if (hoveredSA2Id !== null) {
            this.map.setFeatureState(
              { source: 'sa2', id: hoveredSA2Id },
              { hover: false }
            );
          }
          hoveredSA2Id = e.features[0].id;
          this.map.setFeatureState(
            { source: 'sa2', id: hoveredSA2Id },
            { hover: true }
          );
        }
      });
       
      // When the mouse leaves the sa2-fill layer, update the feature state of the
      // previously hovered feature.
      
      this.map.on('mouseleave', 'sa2-fills', () => {
        if (hoveredSA2Id !== null) {
          this.map.setFeatureState(
            { source: 'sa2', id: hoveredSA2Id },
            { hover: false }
          );
        }
        hoveredSA2Id = null;
      });
      
      var hasClicked = false;
      this.map.on('click', 'sa2-fills', (e) => {
        //remove the previous routes
        if (hasClicked) {
          this.map.removeLayer('route');
          this.map.removeLayer('point');
          // this.map.removeLayer('point2')
          this.map.removeSource('route');
          this.map.removeSource('point');
          // this.map.removeSource('point2');
        }
        hasClicked = true;
        var featureObj = {};
        var destinationList = [];
        var origin = [];
        // Reset regions
        clickedFeatures.forEach((f) => {
          // For each feature, update its 'click' state
          this.map.setFeatureState({
            source: 'sa2',
            id: f.id
            },{
            highlight: false
          });
        });

        if (clickedSA2 !== null) {
          this.map.setFeatureState({
            source: 'sa2',
            id: clickedSA2.id
            },{
            click: false
          });
        }
        // Update based on newly selected region
        clickedSA2 = e.features[0]; //properties.name;
        // find the center point of the newly selected region
        origin = turf.center(clickedSA2).geometry.coordinates;
        
        console.log(clickedSA2);
        this.map.setFeatureState({ 
          source: 'sa2', 
          id: clickedSA2.id
          },{
          click: true 
        });

        const sa2_properties = {
          sa2_name: clickedSA2.properties.SA2_NAME16,
          population: toCommas(clickedSA2.properties.persons_num),
          income: '$'+toCommas(clickedSA2.properties.median_aud),
          ggp: clickedSA2.properties.income_diversity,
          jr: clickedSA2.properties.bridge_diversity,
          bgi: clickedSA2.properties.bsns_growth_rate,
          isDefault: false
        };

        setSelect(sa2_properties);

        var bridges = [clickedSA2.properties.bridge_rank1, clickedSA2.properties.bridge_rank2, clickedSA2.properties.bridge_rank3].filter(x => x !== undefined);
        console.log(bridges);
        clickedFeatures = this.map.querySourceFeatures('sa2', {
          sourceLayer: 'original',
          filter: [
            'in', ['to-number', ['get', 'SA2_MAIN16']], ['literal', bridges]
          ]
        });

        // get rid of the repeated features in the clickedFeatures array
        clickedFeatures.forEach((f) => {
          // For each feature, update its 'highlight' state
          this.map.setFeatureState({
            source: 'sa2',
            id: f.id
            },{
            highlight: true
          });
          if (f.properties.SA2_MAIN16 in featureObj) {}
          else {
            featureObj[f.properties.SA2_MAIN16] = f;
          }
        });

        // sort the clickedFeatures based on the ranking in bridges
        var featureList = [];
        bridges.forEach((b) => {
          featureList.push(featureObj[b])
        });

        // create an array of center coordinates of each SA2 region
        featureList.forEach((ft)=>{
          var destination = turf.center(ft).geometry.coordinates;
          destinationList.push(destination);
        });
        //create an array of coordinates corresponding to the bridges
        var coordinateList = [];
        destinationList.forEach((d)=>{
          var pnt =  [origin, d];
          coordinateList.push(pnt);
        });

        var routeList = [];
        // var routeList2 = [];
        var pointList = [];
        // var pointList2 = [];

        // create point objects based on the coordinateList
        coordinateList.forEach((bridge)=>{
          var bridgeStart = turf.point(bridge[0]);
          var bridgeEnd = turf.point(bridge[1]);
          var greatCircle = turf.greatCircle(bridgeStart, bridgeEnd, {'name': 'start to end', 'npoints': 500});
          // var greatCircle2 = turf.greatCircle(bridgeEnd, bridgeStart, {'name': 'start to end', 'npoints': 500});
          routeList.push(greatCircle);
          // routeList2.push(greatCircle2);
          var pointObj = {
              'type': 'Feature',
              'properties': {},
              'geometry': {
              'type': 'Point',
              'coordinates': bridge[0]}
          }
          // var pointObj2 = {
          //     'type': 'Feature',
          //     'properties': {},
          //     'geometry': {
          //     'type': 'Point',
          //     'coordinates': bridge[1]}
          // }
            pointList.push(pointObj);
            // pointList2.push(pointObj2);
        });
        //color the bridges according to the ranking
        if (routeList[0]) {
          routeList[0].properties = {'color': '#01579B'};
        }
        // routeList[0].properties = {'color': '#01579B'};
        if (routeList[1]) {
          routeList[1].properties = {'color': '#29B6F6'};
        }
        if (routeList[2]) {
          routeList[2].properties = {'color': '#B3E5FC'};
        }
        // routeList[1].properties = {'color': '#29B6F6'};
        // routeList[2].properties = {'color': '#B3E5FC'};

        var route = {
          'type': 'FeatureCollection',
          'features': routeList,
        };
        // var route2 = {
        //   'type': 'FeatureCollection',
        //   'features': routeList2,
        // }
        var point = {
          'type': 'FeatureCollection',
          'features': pointList,
        };
        // var point2 = {
        //   'type': 'FeatureCollection',
        //   'features': pointList2,
        // };
               
        // // Number of steps to use in the arc and animation, more steps means
        // // a smoother arc and animation, but too many steps will result in a
        // // low frame rate
        var steps = 1000;
               
        
        // add route source to the map
        this.map.addSource('route', {
          'type': 'geojson',
          'data': route
        });
        // add point source to the map  
        this.map.addSource('point', {
          'type': 'geojson',
          'data': point
        });
        // this.map.addSource('point2', {
        //   'type': 'geojson',
        //   'data': point2
        // });
        
        // add route layer to the map
        this.map.addLayer({
          'id': 'route',
          'source': 'route',
          'type': 'line',
          'layout': {
              'line-cap': 'round'
          },
          'paint': {
            'line-width': 6,
            'line-dasharray': [0, 2],
            'line-color': ['get', 'color']
          }
        });
        // add point layer to the map
        this.map.addLayer({
          'id': 'point',
          'source': 'point',
          'type': 'symbol',
          'layout': {
            'icon-image': 'triangle-11',
            'icon-rotate': ['get', 'bearing'],
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'icon-ignore-placement': true
          },
          "paint": {
            "icon-color": "#00ff00",
            "icon-halo-color": "#fff",
            "icon-halo-width": 2
          },
        });
        // this.map.addLayer({
        //   'id': 'point2',
        //   'source': 'point2',
        //   'type': 'symbol',
        //   'layout': {
        //     'icon-image': 'triangle-11',
        //     'icon-rotate': ['get', 'bearing'],
        //     'icon-rotation-alignment': 'map',
        //     'icon-allow-overlap': true,
        //     'icon-ignore-placement': true
        //   },
        //   "paint": {
        //     "icon-color": "#00ff00",
        //     "icon-halo-color": "#fff",
        //     "icon-halo-width": 2
        //   },
        // });
        var that = this;

        function animate(featureIdx, cntr, point, route, pointID) {
          // Update point geometry to a new position based on counter denoting
          // the index to access the arc.
          if (cntr >= route.features[featureIdx].geometry.coordinates.length-1){
            return;
          }
          point.features[featureIdx].geometry.coordinates = route.features[featureIdx].geometry.coordinates[cntr];
      
          point.features[featureIdx].properties.bearing = turf.bearing(
            turf.point(route.features[featureIdx].geometry.coordinates[cntr >= steps ? cntr - 1 : cntr]),
            turf.point(route.features[featureIdx].geometry.coordinates[cntr >= steps ? cntr : cntr + 1])
          );  
              
          // Update the source with this new data.
          that.map.getSource(pointID).setData(point);
          if ((cntr+2) === 500) {
            cntr = 0;
          }
          // Request the next frame of animation so long the end has not been reached.
          if (cntr < steps) {
            requestAnimationFrame(function(){animate(featureIdx, cntr+1, point, route, pointID);});
          }
      
        }

        // Reset the counter used for outflow
        var cntr0 = 0;
        var cntr1 = 0;
        var cntr2 = 0;
        // Reset the counter used for inflow
        // var cntr3 = 0;
        // var cntr4 = 0;
        // var cntr5 = 0;
        
        // Restart the animation for outflow
        if (bridges[0]) {
          animate(0,cntr0, point, route, 'point');
        }
        if (bridges[1]) {
          animate(1,cntr1, point, route, 'point');
        }
        // animate(1,cntr1, point, route, 'point');
        if (bridges[2]) {
          animate(2,cntr2, point, route, 'point'); 
        }
        // animate(2,cntr2, point, route, 'point'); 

        // Restart the animation for inflow
        // animate(0,cntr3, point2, route2, 'point2');
        // animate(1,cntr4, point2, route2, 'point2');
        // animate(2,cntr5, point2, route2, 'point2');

      });



    });
  }

  render() {
    return (
      <div ref={this.mapRef} className="absolute top right left bottom" />
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data,
    active: state.active,
    select: state.select,
  };
}

function toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
 
Map = connect(mapStateToProps)(Map);

export default Map;
