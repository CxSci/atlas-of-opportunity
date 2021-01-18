import React from "react";
import { setSelect } from "../redux/action-creators";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";

import "../css/map.css";

import * as Constants from "../constants";

const turf = window.turf;
mapboxgl.accessToken =
  "pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q";

let Map = class Map extends React.Component {
  mapRef = React.createRef();
  geocoder;
  map;
  hoveredPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    // maxWidth: "200px",
  });
  clickedPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  cntr0Popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  cntr1Popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  cntr2Popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  constructor(props) {
    super(props);
    this.state = {
      clickedSA2: null,
      clickedFeatures: [],
    };
  }

  static propTypes = {
    // data: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired,
    modal: PropTypes.bool,
    flowDirection: PropTypes.string.isRequired,
    searchBarInfo: PropTypes.arrayOf(PropTypes.number),
  };

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: "mapbox://styles/xmzhu/ckbqk0jmp4o041ipd7wkb39fw",
      center: [121, -26.5],
      zoom: 3.5,
    });

    if (this.props.modal === false) {
      this.map.flyTo({
        center: [138.7, -34.9],
        zoom: 9,
        speed: 0.8,
      });
    }

    var hoveredSA2Id = null;

    this.map.on("load", () => {
      this.map.addSource("sa2", {
        type: "geojson",
        data: this.props.data,
      });

      this.map.addLayer({
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
            property: this.props.active.property,
            stops: this.props.active.stops,
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

      this.map.addLayer({
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
      // name of sa2-fills appear over the region

      this.map.on("mousemove", "sa2-fills", (e) => {
        if (e.features.length > 0) {
          var coordinates = turf.center(e.features[0]).geometry.coordinates;
          var regionName = e.features[0].properties.SA2_NAME16;
          var medIncome = e.features[0].properties.median_aud.toLocaleString(
            undefined,
            {
              style: "currency",
              currency: "AUS",
            }
          );
          this.hoveredPopup
            .setLngLat(coordinates)
            .setHTML(
              "<h5>" +
                regionName +
                "</h5> <p> <b> Population: </b> " +
                e.features[0].properties.persons_num +
                "<br /> <b> Median Income (AUS): </b>" +
                medIncome +
                "<br / > <b> GDP Growth Potential: </b>" +
                e.features[0].properties.income_diversity +
                "<br / > <b> Job Resiliance: </b>" +
                e.features[0].properties.bridge_diversity +
                "</p>"
            )
            .addTo(this.map);

          if (hoveredSA2Id !== null) {
            this.map.setFeatureState(
              { source: "sa2", id: hoveredSA2Id },
              { hover: false }
            );
          }

          hoveredSA2Id = e.features[0].id;
          this.map.setFeatureState(
            { source: "sa2", id: hoveredSA2Id },
            { hover: true }
          );
        }
      });

      // When the mouse leaves the sa2-fill layer, update the feature state of the
      // previously hovered feature.

      this.map.on("mouseleave", "sa2-fills", () => {
        if (hoveredSA2Id !== null) {
          this.map.setFeatureState(
            { source: "sa2", id: hoveredSA2Id },
            { hover: false }
          );
        }

        hoveredSA2Id = null;

        // Remove hovered popup
        this.hoveredPopup.remove();
      });

      this.map.on("click", "sa2-fills", this.onMapClick);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.flowDirection !== prevProps.flowDirection) {
      this.redrawBridges();
    }
    if (this.props.searchBarInfo !== prevProps.searchBarInfo) {
      this.onMapSearch(this.props.searchBarInfo);
    }
  }

  onMapSearch = (e) => {
    this.map.fire("click", {
      latlng: e,
      point: this.map.project(e),
    });
    this.map.flyTo({
      center: e,
      zoom: 11,
      speed: 1.2,
      curve: 1,
      easing: function (t) {
        return t;
      },
    });
  };

  onMapClick = (e) => {
    let prevSA2 = this.state.clickedSA2;
    let clickedSA2 = e.features[0]; //properties.name;
    // Ignore clicks on the active SA2.
    if (
      !prevSA2 ||
      clickedSA2.properties.SA2_NAME16 !== prevSA2.properties.SA2_NAME16
    ) {
      this.redrawBridges(e);
    }
  };

  // Called when an SA2 is clicked and when the flow direction changes.
  redrawBridges = (e) => {
    var clickedFeatures = this.state.clickedFeatures;
    var clickedSA2 = this.state.clickedSA2;

    // Remove popup
    this.clickedPopup.remove();
    this.cntr0Popup.remove();
    this.cntr1Popup.remove();
    this.cntr2Popup.remove();

    //remove the previous routes
    if (this.map.getLayer("route") !== undefined) {
      this.map.removeLayer("route");
      this.map.removeSource("route");
    }
    if (this.map.getLayer("point") !== undefined) {
      this.map.removeLayer("point");
      this.map.removeSource("point");
    }
    var featureObj = {};
    var destinationList = [];
    var origin = [];
    var regionName;

    // Reset regions
    clickedFeatures.forEach((f) => {
      // For each feature, update its 'click' state
      this.map.setFeatureState(
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
      this.map.setFeatureState(
        {
          source: "sa2",
          id: clickedSA2.id,
        },
        {
          click: false,
        }
      );
    }
    // Reuse existing region if this call was due to a flow direction change.
    if (e) {
      // Update based on newly selected region.
      clickedSA2 = e.features[0];
    }
    // find the center point of the newly selected region
    origin = turf.center(clickedSA2).geometry.coordinates;
    regionName = clickedSA2.properties.SA2_NAME16;

    // Set name of clicked region over it
    this.clickedPopup
      .setLngLat(origin)
      .setHTML("<h5>" + regionName + "</h5>")
      .addTo(this.map);

    this.map.setFeatureState(
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
    let keys = this.props.active.bridgeKeys[this.props.flowDirection];
    // Get bridges and ignore missing values
    let bridges = keys
      .map((x) => clickedSA2.properties[x])
      .filter((x) => x !== undefined);

    // Search map for SA2s matching the bridges.
    clickedFeatures = this.map.querySourceFeatures("sa2", {
      sourceLayer: "original",
      filter: [
        "in",
        ["to-number", ["get", "SA2_MAIN16"]],
        ["literal", bridges],
      ],
    });

    // get rid of the repeated features in the clickedFeatures array
    clickedFeatures.forEach((f) => {
      // For each feature, update its 'highlight' state
      this.map.setFeatureState(
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

    // Update component state now that our changes are ready.
    this.setState({ clickedSA2: clickedSA2 });
    this.setState({ clickedFeatures: clickedFeatures });

    // sort the clickedFeatures based on the ranking in bridges
    var featureList = [];
    bridges.forEach((b) => {
      featureList.push(featureObj[b]);
    });

    // create an array of center coordinates of each SA2 region
    featureList.forEach((ft, i) => {
      var destination = turf.center(ft).geometry.coordinates;
      var regionName = ft.properties.SA2_NAME16;
      destinationList.push(destination);

      // Set name of related regions over them
      switch (i) {
        case 1:
          this.cntr1Popup
            .setLngLat(destination)
            .setHTML("<h5>" + regionName + "</h5>")
            .addTo(this.map);
          break;
        case 2:
          this.cntr2Popup
            .setLngLat(destination)
            .setHTML("<h5>" + regionName + "</h5>")
            .addTo(this.map);
          break;
        default:
          this.cntr0Popup
            .setLngLat(destination)
            .setHTML("<h5>" + regionName + "</h5>")
            .addTo(this.map);
      }
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
    this.map.addSource("route", {
      type: "geojson",
      data: route,
    });
    this.map.addLayer({
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
    if (this.props.flowDirection !== Constants.FLOW_BI) {
      // add point source and layer to the map
      this.map.addSource("point", {
        type: "geojson",
        data: point,
      });
      this.map.addLayer({
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
    var that = this;

    function animate(featureIdx, cntr, point, route, pointID) {
      // Update point geometry to a new position based on counter denoting
      // the index to access the arc.
      if (cntr >= route.features[featureIdx].geometry.coordinates.length - 1) {
        return;
      }
      var cntrIdx = cntr;
      if (that.props.flowDirection === Constants.FLOW_IN) {
        cntrIdx = route.features[featureIdx].geometry.coordinates.length - cntr;
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
      if (that.props.flowDirection === Constants.FLOW_IN) {
        [a, b] = [b, a];
      }

      point.features[featureIdx].properties.bearing = turf.bearing(a, b);

      // Update the source with this new data.
      let source = that.map.getSource(pointID);
      if (source !== undefined) {
        that.map.getSource(pointID).setData(point);
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
    if (this.props.flowDirection !== Constants.FLOW_BI) {
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
  };

  render() {
    return (
      <div>
        <div ref={this.mapRef} className="absolute top right left bottom" />
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    data: state.data,
    active: state.active,
    select: state.select,
    modal: state.modal,
    flowDirection: state.flowDirection,
    searchBarInfo: state.searchBarInfo,
  };
}

Map = connect(mapStateToProps)(Map);

export default Map;
