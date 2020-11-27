import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { setSelect } from "../redux/action-creators";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import * as Constants from "../constants";

const turf = window.turf;
mapboxgl.accessToken =
  "pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q";

const MapTest = (props) => {
  const [mapRef] = useState(React.createRef());
  const [map, setMap] = useState();
  const [geocoder, setGeocoder] = useState();
  const [clickedSA2, setClickedSA2] = useState(null);
  const [eventClick, setEventClick] = useState(null);
  const [clickedFeatures, setClickedFeatures] = useState([]);
  const [bridges, setBridges] = useState([]);

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

      if (props.modal === false) {
        map.flyTo({
          center: [138.7, -34.9],
          zoom: 9,
          speed: 0.8,
        });
      }

      if (document.getElementById("geocoder")) {
        document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
      }

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

        geocoder.on("result", function (e) {
          map.fire("click", {
            point: map.project(e.result.center),
          });
        });

        map.on("click", "sa2-fills", onMapClick);
      });
    }
  }, [map]);

  const onMapClick = (e) => {
    console.log("clicked");
    setEventClick(e.features[0]); //properties.name;
  };

  useEffect(() => {
    console.log("eventclicked");
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
      setClickedSA2(eventClick);
    }
  }, [eventClick]);

  useEffect(() => {
    console.log("clickedSA2 out");
    if (eventClick !== null) {
      console.log("clickedSA2 in");

      if (map.getLayer("route") !== undefined) {
        map.removeLayer("route");
        map.removeSource("route");
      }
      if (map.getLayer("point") !== undefined) {
        map.removeLayer("point");
        map.removeSource("point");
      }

      clickedFeatures.forEach((f) => {
        // For each feature, update its 'click' state
        map.setFeatureState(
          {
            source: "sa2",
            id: f.id,
          },
          {
            highlight: false,
          }
        );
      });

      if (clickedSA2 !== null) {
        map.setFeatureState(
          {
            source: "sa2",
            id: clickedSA2.id,
          },
          {
            click: false,
          }
        );
      }

      map.setFeatureState(
        {
          source: "sa2",
          id: clickedSA2.id,
        },
        {
          click: true,
        }
      );

      const sa2_properties = {
        sa2_name: clickedSA2.properties.SA2_NAME16,
        population: clickedSA2.properties.persons_num.toLocaleString(),
        income: clickedSA2.properties.median_aud.toLocaleString(undefined, {
          style: "currency",
          currency: "AUS",
        }),
        ggp: clickedSA2.properties.income_diversity,
        jr: clickedSA2.properties.bridge_diversity,
        fq1: clickedSA2.properties.fq1,
        fq2: clickedSA2.properties.fq2,
        fq3: clickedSA2.properties.fq3,
        fq4: clickedSA2.properties.fq4,
        bgi: clickedSA2.properties.bsns_growth_rate,
        sa1_codes: clickedSA2.properties.SA1_7DIGITCODE_LIST,
        isDefault: false,
      };

      setSelect(sa2_properties);

      // Show the bridges for the selected flow direction {in, out, bi-directional}.
      // flowDirection should be one of "inflow", "outflow", or "bidirectional"
      // e.g. keys = ["inflow_r1", "inflow_r2", "inflow_r3"]
      let keys = props.active.bridgeKeys[props.flowDirection];

      // Get bridges and ignore missing values
      setBridges(
        keys.map((x) => clickedSA2.properties[x]).filter((x) => x !== undefined)
      );
    }
  }, [clickedSA2]);

  useEffect(() => {
    console.log("bridges out");
    if (clickedSA2 !== null) {
      console.log("bridges in");
      // Search map for SA2s matching the bridges.
      setClickedFeatures(
        map.querySourceFeatures("sa2", {
          sourceLayer: "original",
          filter: [
            "in",
            ["to-number", ["get", "SA2_MAIN16"]],
            ["literal", bridges],
          ],
        })
      );
    }
  }, [bridges]);

  useEffect(() => {
    console.log("clickFeatures out");
    if (bridges.length !== 0) {
      console.log("clickFeatures in");
      var featureObj = {};
      var destinationList = [];
      var origin = [];

      origin = turf.center(clickedSA2).geometry.coordinates;

      // get rid of the repeated features in the clickedFeatures array
      clickedFeatures.forEach((f) => {
        // For each feature, update its 'highlight' state
        map.setFeatureState(
          {
            source: "sa2",
            id: f.id,
          },
          {
            highlight: true,
          }
        );
        if (f.properties.SA2_MAIN16 in featureObj) {
        } else {
          featureObj[f.properties.SA2_MAIN16] = f;
        }
      });

      var featureList = [];
      bridges.forEach((b) => {
        featureList.push(featureObj[b]);
      });

      // create an array of center coordinates of each SA2 region
      featureList.forEach((ft) => {
        var destination = turf.center(ft).geometry.coordinates;
        destinationList.push(destination);
      });
      //create an array of coordinates corresponding to the bridges
      var coordinateList = [];
      destinationList.forEach((d) => {
        var pnt = [origin, d];
        coordinateList.push(pnt);
      });

      var routeList = [];
      var pointList = [];

      // create point objects based on the coordinateList
      coordinateList.forEach((bridge) => {
        var bridgeStart = turf.point(bridge[0]);
        var bridgeEnd = turf.point(bridge[1]);
        var greatCircle = turf.greatCircle(bridgeStart, bridgeEnd, {
          name: "start to end",
          npoints: 500,
        });
        routeList.push(greatCircle);
        var pointObj = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: bridge[0],
          },
        };
        pointList.push(pointObj);
      });
      //color the bridges according to the ranking
      if (routeList[0]) {
        routeList[0].properties = { color: "#01579B" };
      }
      // routeList[0].properties = {"color": "#01579B"};
      if (routeList[1]) {
        routeList[1].properties = { color: "#29B6F6" };
      }
      if (routeList[2]) {
        routeList[2].properties = { color: "#B3E5FC" };
      }
      // routeList[1].properties = {"color": "#29B6F6"};
      // routeList[2].properties = {"color": "#B3E5FC"};

      var route = {
        type: "FeatureCollection",
        features: routeList,
      };
      var point = {
        type: "FeatureCollection",
        features: pointList,
      };

      // add route source and layer to the map
      map.addSource("route", {
        type: "geojson",
        data: route,
      });
      map.addLayer({
        id: "route",
        source: "route",
        type: "line",
        layout: {
          "line-cap": "round",
        },
        paint: {
          "line-width": 6,
          "line-dasharray": [0, 2],
          "line-color": ["get", "color"],
        },
      });
      // Don't show point for bi-directional flows.
      if (props.flowDirection !== Constants.FLOW_BI) {
        // add point source and layer to the map
        map.addSource("point", {
          type: "geojson",
          data: point,
        });
        map.addLayer({
          id: "point",
          source: "point",
          type: "symbol",
          layout: {
            "icon-image": "triangle-11",
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
          },
          paint: {
            "icon-color": "#00ff00",
            "icon-halo-color": "#fff",
            "icon-halo-width": 2,
          },
        });
      }

      // Number of steps to use in the arc and animation, more steps means
      // a smoother arc and animation, but too many steps will result in a
      // low frame rate
      let steps = 1000;

      function animate(featureIdx, cntr, point, route, pointID) {
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.
        if (
          cntr >=
          route.features[featureIdx].geometry.coordinates.length - 1
        ) {
          return;
        }
        var cntrIdx = cntr;
        if (props.flowDirection === Constants.FLOW_IN) {
          cntrIdx =
            route.features[featureIdx].geometry.coordinates.length - cntr;
        }

        point.features[featureIdx].geometry.coordinates =
          route.features[featureIdx].geometry.coordinates[cntrIdx];

        let a = turf.point(
          route.features[featureIdx].geometry.coordinates[
            cntr >= steps ? cntr - 1 : cntr
          ]
        );
        let b = turf.point(
          route.features[featureIdx].geometry.coordinates[
            cntr >= steps ? cntr : cntr + 1
          ]
        );

        // Default is outflow. Flip coordinates for inflow.
        if (props.flowDirection === Constants.FLOW_IN) {
          [a, b] = [b, a];
        }

        point.features[featureIdx].properties.bearing = turf.bearing(a, b);

        // Update the source with this new data.
        let source = map.getSource(pointID);
        if (source !== undefined) {
          map.getSource(pointID).setData(point);
          if (cntr + 2 === 500) {
            cntr = 0;
          }
          // Request the next frame of animation so long the end has not been reached.
          if (cntr < steps) {
            requestAnimationFrame(function () {
              animate(featureIdx, cntr + 1, point, route, pointID);
            });
          }
        }
      }

      // Reset the counter used for in and outflow
      var cntr0 = 0;
      var cntr1 = 0;
      var cntr2 = 0;

      // Skip animation for bidirectional flow.
      if (props.flowDirection !== Constants.FLOW_BI) {
        // Start the animation for in or outflow
        if (bridges[0]) {
          animate(0, cntr0, point, route, "point");
        }
        if (bridges[1]) {
          animate(1, cntr1, point, route, "point");
        }
        if (bridges[2]) {
          animate(2, cntr2, point, route, "point");
        }
      }
    }
  }, [clickedFeatures]);

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
    paddingTop: "90px",
    paddingLeft: "24px",
  };

  return (
    <div>
      <div ref={mapRef} className="absolute top right left bottom" />
      {props.modal ? null : <div id="geocoder" style={search}></div>}
    </div>
  );
};

MapTest.propTypes = {
  data: PropTypes.object.isRequired,
  active: PropTypes.object.isRequired,
  modal: PropTypes.bool,
  flowDirection: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    data: state.data,
    active: state.active,
    modal: state.modal,
    flowDirection: state.flowDirection,
  };
}

export default connect(mapStateToProps)(MapTest);
