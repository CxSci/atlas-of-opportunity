import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { connect } from 'react-redux'
import SA_atlas from '../data/SA_atlas.geojson'

mapboxgl.accessToken = 'pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q'

let Map = class Map extends React.Component {
  mapRef = React.createRef();
  map;

  static propTypes = {
    data: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired
  };

  componentDidUpdate() {
    this.setFill();
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/xmzhu/ckbqk0jmp4o041ipd7wkb39fw',
      center: [138.7, -34.9],
      zoom: 9
    });

    var hoveredSA2Id = null;
    var clickedSA2 = null;

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
        data: SA_atlas
      });

      this.map.addLayer({
        'id': 'sa2-fills',
        'type': 'fill',
        'source': 'sa2',
        'layout': {},
        'paint': {
          'fill-color': {
            property: 'income_diversity',
            stops: [[0.1024, '#fdedc4'], [0.66, '#f09647'], [1.2168, '#dd4b27']]
            },
          'fill-opacity': [
            'case',
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
        'layout': {},
        'paint': {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            '#ff0000',
            '#fef4e1'
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            2,
            1
          ],
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1.5,
            0.5
          ]
        }
      });

      // When the user moves their mouse over the sa2-fill layer, we'll update the
      // feature state for the feature under the mouse.
      this.map.on('mousemove', 'sa2-fills', (e) => {
        console.log(hoveredSA2Id);
        if (e.features.length > 0) {
          if (hoveredSA2Id) {
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
        if (hoveredSA2Id) {
          this.map.setFeatureState(
            { source: 'sa2', id: hoveredSA2Id },
            { hover: false }
          );
        }
        hoveredSA2Id = null;
      });

      this.map.on('click', 'sa2-fills', (e) => {
        /*clickedSA2 = e.features[0].id; //properties.name;
        this.map.setFeatureState(
            { source: 'sa2', id: clickedSA2},
            { click: true }
        );*/

          var clickedFeatures = this.map.querySourceFeatures('sa2_fills', {
            filter: [
              'all',
              ['>', ['to-number', ['get', 'income_diversity']], 0]//e.features[0].properties.inequality]
            ]
          });
          //clickedFeatures = [35, 38, 45 , 16]; //uncomment to see what should happen visually when a region is clicked
          clickedFeatures.forEach((f) => {
            // For each feature, update its 'click' state
            this.map.setFeatureState({
              source: 'sa2',
              id: f
              },{
              click: true
            });
          });
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
    active: state.active
  };
}

Map = connect(mapStateToProps)(Map);

export default Map;
