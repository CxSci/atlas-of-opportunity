import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { connect } from 'react-redux'
import SA_atlas from '../data/SA_dashboard.geojson'

mapboxgl.accessToken = 'pk.eyJ1IjoicHljdzEwOSIsImEiOiJja2JmdWhpYTcwejNqMnFvNXVmb2puOWNkIn0.zseMY8O36O1QOESFeG4vFQ';

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
      style: 'mapbox://styles/mapbox/dark-v10',
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
        data: SA_atlas
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
            stops: [[0.1024, '#FDEDC4'], [0.66, '#F09647'], [1.2168, '#DD4B27']]
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
            '#FEF4E1', 
            '#FEF4E1'
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
        //console.log(hoveredSA2Id);
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

        if (clickedSA2) {
          this.map.setFeatureState({
            source: 'sa2',
            id: clickedSA2.id
            },{
            click: false
          });
        }
        // Update based on newly selected region
        clickedSA2 = e.features[0]; //properties.name;
        this.map.setFeatureState({ 
          source: 'sa2', 
          id: clickedSA2.id
          },{
          click: true 
        });

        var bridges = [clickedSA2.properties.bridge_rank1, clickedSA2.properties.bridge_rank2, clickedSA2.properties.bridge_rank3]

        clickedFeatures = this.map.querySourceFeatures('sa2', {
          sourceLayer: 'original',
          filter: [
            'in', ['to-number', ['get', 'SA2_MAIN16']], ['literal', bridges]
          ]
        });

        clickedFeatures.forEach((f) => {
            // For each feature, update its 'highlight' state
            this.map.setFeatureState({
              source: 'sa2',
              id: f.id
              },{
              highlight: true
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
