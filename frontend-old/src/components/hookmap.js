import React, { useState, useRef, useEffect } from "react";
// import { setSelect } from "../redux/action-creators";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import * as turf from "@turf/turf";

import "../css/map.css";
// import * as Constants from "../constants";
// import SearchBar from "./searchbar";

mapboxgl.accessToken =
  "pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q";

const MapboxGLMap = (props) => {
  const [map, setMap] = useState(null)
  const mapContainer = useRef(null)
  const [hoveredSA2Id, setHoveredSA2Id] = useState(null)
  const [hoveredPopup, setHoveredPopup] = useState(new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
              }))
  // const [clickedSA2, setClickedSA2] = useState(null)
  // const [clickedFeatures, setClickedFeatures] = useState([])

  useEffect(() => {
    const intializeMap = ({setMap, mapContainer}) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v10",
        bounds: [
          [129, -38],
          [141, -26]
        ],
        fitBoundsOptions: { padding: 70 }
      })

      const controls = new mapboxgl.NavigationControl({
        showCompass: false,
      });
      map.addControl(controls, "bottom-right")

      map.on("load", () => {
        setMap(map)
        map.addSource("sa2", {
          type: "geojson",
          data: props.data,
          promoteId: "SA2_MAIN16"
        })

        map.addLayer({
          id: "sa2-fills",
          type: "fill",
          source: "sa2",
          sourceLayer: "original",
          layout: {},
          paint: {
            /*['case',
            ['boolean', ['feature-state', 'click'], false],
            '#696969',
            ]*/
            "fill-color": {
              property: props.active.property,
              stops: props.active.stops,
            },
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              1,
              ["boolean", ["feature-state", "highlight"], false],
              1,
              ["boolean", ["feature-state", "hover"], false],
              1,
              0.8,
            ],
          },
        })

        map.addLayer({
          id: "sa2-borders",
          type: "line",
          source: "sa2",
          sourceLayer: "original",
          layout: {},
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              "#000080",
              ["boolean", ["feature-state", "highlight"], false],
              "#008000",
              ["boolean", ["feature-state", "hover"], false],
              "#fef4e1",
              "#fef4e1",
            ],
            "line-width": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              2,
              ["boolean", ["feature-state", "highlight"], false],
              2,
              ["boolean", ["feature-state", "hover"], false],
              2,
              0.75,
            ],
            "line-opacity": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              1.5,
              ["boolean", ["feature-state", "highlight"], false],
              1.5,
              ["boolean", ["feature-state", "hover"], false],
              1.5,
              0.5,
            ],
          },
        })

        // When the user moves their mouse over the sa2-fill layer, we'll update the
        // feature state for the feature under the mouse.
        // name of sa2-fills appear over the region

        map.on("mousemove", "sa2-fills", (e) => {
          if (e.features.length > 0) {
            var coordinates = turf.center(e.features[0]).geometry.coordinates;
            var regionName = e.features[0].properties.SA2_NAME16;
            var medIncome = e.features[0].properties.median_aud.toLocaleString(
              undefined,
              {
                style: "currency",
                currency: "AUD",
              }
            );

            hoveredPopup
              .setLngLat(coordinates)
              .setHTML(
                "<h5>" +
                  regionName +
                  "</h5> <p> <b> Population: </b> " +
                  e.features[0].properties.persons_num +
                  "<br /> <b> Median Income (AUD): </b>" +
                  medIncome +
                  "<br / > <b> GDP Growth Potential: </b>" +
                  e.features[0].properties.income_diversity +
                  "<br / > <b> Job Resiliance: </b>" +
                  e.features[0].properties.bridge_diversity +
                  "</p>"
              )
              .addTo(map);

            if (hoveredSA2Id !== null) {
              map.setFeatureState(
                { source: "sa2", id: hoveredSA2Id },
                { hover: false }
              );
            }

            setHoveredSA2Id(e.features[0].properties.SA2_MAIN16);
            map.setFeatureState(
              { source: "sa2", id: hoveredSA2Id },
              { hover: true }
            );
          }
        });

        // When the mouse leaves the sa2-fill layer, update the feature state of the
        // previously hovered feature.

        map.on("mouseleave", "sa2-fills", () => {
          if (hoveredSA2Id !== null) {
            map.setFeatureState(
              { source: "sa2", id: hoveredSA2Id },
              { hover: false }
            );
          }

          setHoveredSA2Id(null)

          // Remove hovered popup
          hoveredPopup.remove()
          setHoveredPopup(null)
        });
      })
    }

    if (!map) {
      intializeMap({ setMap, mapContainer })
    }
  }, [map, props.data, props.active.property, props.active.stops, hoveredSA2Id, hoveredPopup])

  return <div ref={mapContainer} className="absolute top right left bottom" />
}

MapboxGLMap.propTypes = {
  data: PropTypes.string.isRequired,
  active: PropTypes.object.isRequired,
  select: PropTypes.object.isRequired,
  flowDirection: PropTypes.string.isRequired,
  searchBarInfo: PropTypes.arrayOf(PropTypes.number),
};

function mapStateToProps(state) {
  return {
    data: state.data,
    active: state.active,
    select: state.select,
    flowDirection: state.flowDirection,
    searchBarInfo: state.searchBarInfo,
  };
}

export default connect(mapStateToProps)(MapboxGLMap)
