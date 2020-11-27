import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { setSelect } from "../redux/action-creators";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q";

const SegregationTest = (props) => {
  const [mapRef] = useState(React.createRef());
  const [map, setMap] = useState();
  const [geocoder, setGeocoder] = useState();
  const [clickedSA2, setClickedSA2] = useState(null);
  const [eventClick, setEventClick] = useState(null);

  useEffect(() => {
    setMap(
      new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/xmzhu/ckbqk0jmp4o041ipd7wkb39fw",
        center: [121, -26.5],
        zoom: 3.5,
      })
    );
    setGeocoder(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: "neighborhood, locality, address",
        countries: "au",
        bbox: [
          128.979500521469,
          -38.140346399969,
          141.002957,
          -25.9963750760608,
        ],
        marker: null,
        flyTo: {
          bearing: 0,
          speed: 1.2,
          curve: 1,
          easing: function (t) {
            return t;
          },
        },
        mapboxgl: mapboxgl,
      })
    );
  }, []);

  useEffect(() => {
    if (map !== undefined) {
      var hoveredSA2Id = null;

      map.on("load", () => {
        map.addSource("sa2", {
          type: "geojson",
          data: props.data,
        });

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
        });

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
        });

        // When the user moves their mouse over the sa2-fill layer, we'll update the
        // feature state for the feature under the mouse.
        map.on("mousemove", "sa2-fills", (e) => {
          if (e.features.length > 0) {
            if (hoveredSA2Id !== null) {
              map.setFeatureState(
                { source: "sa2", id: hoveredSA2Id },
                { hover: false }
              );
            }
            hoveredSA2Id = e.features[0].id;
            map.setFeatureState(
              { source: "sa2", id: e.features[0].id },
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
          hoveredSA2Id = null;
        });

        map.on("click", "sa2-fills", onMapClick);

        geocoder.on("result", function (e) {
          map.fire("click", {
            point: map.project(e.result.center),
          });
        });
      });
    }
  }, [map]);

  const onMapClick = (e) => {
    setEventClick(e.features[0]); //properties.name;
  };

  useEffect(() => {
    let prevSA2 = clickedSA2;

    // Ignore clicks on the active SA2.
    if (
      !prevSA2 ||
      eventClick.properties.SA2_NAME16 !== prevSA2.properties.SA2_NAME16
    ) {
      if (prevSA2 !== null && map !== undefined) {
        map.setFeatureState(
          {
            source: "sa2",
            id: prevSA2.id,
          },
          {
            click: false,
          }
        );
      }
    }

    if (map !== undefined) {
      map.setFeatureState(
        {
          source: "sa2",
          id: eventClick.id,
        },
        {
          click: true,
        }
      );
    }

    setClickedSA2(eventClick);
  }, [eventClick]);

  useEffect(() => {
    if (eventClick !== null) {
      let sa2_properties = {
        sa2_name: eventClick.properties.SA2_NAME16,
        population: toCommas(eventClick.properties.persons_num),
        income: "$" + toCommas(eventClick.properties.median_aud),
        quartile: eventClick.properties.quartile,
        fq1: eventClick.properties.fq1,
        fq2: eventClick.properties.fq2,
        fq3: eventClick.properties.fq3,
        fq4: eventClick.properties.fq4,
        inequality: eventClick.properties.inequality,
        ggp: eventClick.properties.income_diversity,
        jr: eventClick.properties.bridge_diversity,
        bgi: eventClick.properties.bsns_growth_rate,
        sa1_codes: eventClick.properties.SA1_7DIGITCODE_LIST,
        isDefault: false,
      };

      setSelect(sa2_properties);
    }
  }, [clickedSA2]);

  useEffect(() => {
    if (props.modal === false && map !== undefined) {
      map.flyTo({
        center: [138.7, -34.9],
        zoom: 9,
        speed: 0.8,
      });
    }
    if (document.getElementById("geocoder")) {
      document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
    }
  }, [props.modal]);

  // Style components
  const search = {
    marginTop: "90px",
    marginLeft: "24px",
  };

  return (
    <div>
      <div ref={mapRef} className="absolute top right left bottom" />
      {props.modal ? null : <div id="geocoder" style={search}></div>}
    </div>
  );
};

SegregationTest.propTypes = {
  data: PropTypes.object.isRequired,
  active: PropTypes.object.isRequired,
  modal: PropTypes.bool,
  clickedSA2: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    data: state.data,
    active: state.active,
    modal: state.modal,
    clickedSA2: state.clickedSA2,
  };
}

function toCommas(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default connect(mapStateToProps)(SegregationTest);
