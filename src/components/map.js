import React from "react";
import { setSelect } from "../redux/action-creators";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import { setSelectedFeature } from "../redux/action-creators";
import * as turf from "@turf/turf";

import "../css/map.css";

import * as Constants from "../constants";

mapboxgl.accessToken =
  "pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q";

let Map = class Map extends React.Component {
  mapRef = React.createRef();
  geocoder;
  map;
  hoveredPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
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
      connectedFeatures: [],
      highlightedFeature: null,
      selectedFeature: null,
    };
  }

  static propTypes = {
    features: PropTypes.arrayOf(PropTypes.object).isRequired,
    geojsonURL: PropTypes.string.isRequired,
    active: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired,
    flowDirection: PropTypes.string.isRequired,
    searchBarInfo: PropTypes.arrayOf(PropTypes.number),
    sidebarOpen: PropTypes.bool.isRequired,
    selectedFeature: PropTypes.object,
    highlightedFeature: PropTypes.object,
  };

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      bounds: [
        [129, -38],
        [141, -26]
      ],
      fitBoundsOptions: { padding: 70 },
    });

    this.map.resize();

    // zoom buttons
    var controls = new mapboxgl.NavigationControl({
      showCompass: true,
      visualizePitch: true,
    });
    this.map.addControl(controls, "bottom-right");

    this.map.on("load", () => {
      this.map.addSource("sa2", {
        type: "geojson",
        data: this.props.geojsonURL,
        promoteId: "SA2_MAIN16",
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
          this.highlightFeature(e.features[0])
        }
      });

      // When the mouse leaves the sa2-fill layer, update the feature state of the
      // previously hovered feature.

      this.map.on("mouseleave", "sa2-fills", this.clearFeatureHighlight);

      // Handle clicks on map features
      this.map.on("click", "sa2-fills", this.onMapClick)
      // Handle map clicks outside of map features
      this.map.on("click", this.onMapClick);
    });
  }

  highlightFeature = (feature) => {
    const prevId = this.state.highlightedFeature?.properties?.SA2_MAIN16
    const newId = feature?.properties?.SA2_MAIN16
    if (prevId === newId) {
      return
    }
    // First, clear any old highlight
    if (this.state.highlightedFeature) {
      this.map.setFeatureState(
        { source: "sa2", id: prevId },
        { hover: false }
      );
    }

    this.setState({ highlightedFeature: feature })

    // Skip the two SA2s which lack geometry, as they don't correspond to
    // geographic areas and aren't mappable.
    if (feature && feature.geometry) {
      var coordinates = turf.centerOfMass(feature).geometry.coordinates;
      var regionName = feature.properties.SA2_NAME16;
      this.hoveredPopup
        .setLngLat(coordinates)
        .setHTML(`<h5>${regionName}</h5>`)
        .addTo(this.map);

      this.map.setFeatureState(
        { source: "sa2", id: feature.properties.SA2_MAIN16 },
        { hover: true }
      );
    } else {
      this.hoveredPopup.remove();
    }
  }

  clearFeatureHighlight = () => {
    this.highlightFeature(null)
  }

  componentDidUpdate(prevProps) {
    if (this.props.sidebarOpen !== prevProps.sidebarOpen
      || (this.props.selectedFeature !== prevProps.selectedFeature
        && (!this.props.selectedFeature || !prevProps.selectedFeature)
      )
    ) {
      this.map.resize();
    }

    if (this.props.flowDirection !== prevProps.flowDirection) {
      this.redrawBridges();
    }

    if (this.props.active.name !== prevProps.active.name) {
      let fillColor = {
        property: this.props.active.property,
        stops: this.props.active.stops,
      };

      this.map.setPaintProperty("sa2-fills", "fill-color", fillColor);
    }

    if (this.props.highlightedFeature !== prevProps.highlightedFeature) {
      this.highlightFeature(this.props.highlightedFeature)
    }

    if (this.props.selectedFeature !== prevProps.selectedFeature) {
      this.selectFeature(this.props.selectedFeature)
    }
  }

  selectFeature = (feature) => {
    const prevId = this.state.selectedFeature?.properties?.SA2_MAIN16
    const newId = feature?.properties?.SA2_MAIN16
    if (prevId === newId) {
      return
    }

    this.redrawBridges(feature)
    if (feature && (feature.geometry || feature._geometry)) {
      const [minX, minY, maxX, maxY] = turf.bbox(feature)
      this.map.fitBounds(
        [[minX, minY], [maxX, maxY]],
        {
          maxZoom: 10,
          padding: 100,
          bearing: this.map.getBearing(),
          pitch: this.map.getPitch(),
        }
      )
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
    // Ignore clicks that were already consumed by a deeper handler  e.g. if
    // the user clicked on a map feature, ignore the same click event when
    // seen by the overall map.
    if (e.defaultPrevented) {
      return
    }
    e.preventDefault()

    let prevSA2 = this.state.selectedFeature;
    let clickedFeature = e.features ? e.features[0] : null

    if (clickedFeature) {
      // Make sure this feature has a `primary` property for when it becomes
      // selectedFeature, as the search field adds that to its own features and
      // expects passed in features to have the same.
      // TODO: Make SearchField and SASearchField smart enough to handle
      //       features which lack `primary`.
      clickedFeature.properties.primary = clickedFeature.properties.SA2_NAME16
    }

    // Ignore clicks on the active SA2.
    if (
      !prevSA2 ||
      clickedFeature !== prevSA2 ||
      clickedFeature.properties.SA2_MAIN16 !== prevSA2.properties.SA2_MAIN16
    ) {
      this.redrawBridges(clickedFeature);
      setSelectedFeature(clickedFeature)
    }
  };

  // Called when an SA2 is clicked and when the flow direction changes.
  redrawBridges = (feature) => {
    let connectedFeatures = this.state.connectedFeatures;

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
    connectedFeatures.forEach((f) => {
      // For each feature, update its 'click' state
      this.map.setFeatureState(
        {
          source: "sa2",
          id: f.properties.SA2_MAIN16,
        },
        {
          highlight: false,
        }
      );
    });

    if (this.state.selectedFeature) {
      this.map.setFeatureState(
        {
          source: "sa2",
          id: this.state.selectedFeature.properties.SA2_MAIN16,
        },
        {
          click: false,
        }
      );
    }

    this.setState({ selectedFeature: feature })

    // Skip features without geometry, like the two SA2s
    // "Migratory - Offshore - Shipping (SA)" and "No usual address (SA)"
    if (!feature || !(feature.geometry || feature._geometry)) {
      return
    }

    // find the center point of the newly selected region
    origin = turf.centerOfMass(feature).geometry.coordinates;
    regionName = feature.properties.SA2_NAME16;

    // Set name of clicked region over it
    this.clickedPopup
      .setLngLat(origin)
      .setHTML("<h5>" + regionName + "</h5>")
      .addTo(this.map);

    this.map.setFeatureState(
      {
        source: "sa2",
        id: feature.properties.SA2_MAIN16,
      },
      {
        click: true,
      }
    );

    const sa2_properties = {
      sa2_name: feature.properties.SA2_NAME16,
      population: feature.properties.persons_num.toLocaleString(),
      income: feature.properties.median_aud.toLocaleString(undefined, {
        style: "currency",
        currency: "AUS",
      }),
      ggp: feature.properties.income_diversity,
      jr: feature.properties.bridge_diversity,
      quartile: feature.properties.quartile,
      fq1: feature.properties.fq1,
      fq2: feature.properties.fq2,
      fq3: feature.properties.fq3,
      fq4: feature.properties.fq4,
      inequality: feature.properties.inequality,
      bgi: feature.properties.bsns_growth_rate,
      sa1_codes: feature.properties.SA1_7DIGITCODE_LIST,
      isDefault: false,
    };

    setSelect(sa2_properties);

    if (this.props.active.name !== "Inequality") {
      // Show the bridges for the selected flow direction {in, out, bi-directional}.
      // flowDirection should be one of "inflow", "outflow", or "bidirectional"
      // e.g. keys = ["inflow_r1", "inflow_r2", "inflow_r3"]
      let keys = this.props.active.bridgeKeys[this.props.flowDirection];
      // Get bridges and ignore missing values
      // Note that somewhere along the way, Mapbox GL turns GeoJSON properties
      // like {"foo": null} into {"foo": "null"}.
      const bridges = keys
        .map((x) => feature.properties[x])
        .filter((x) => x !== undefined && x !== "null" && typeof x === "number" && isFinite(x))

      // Search map for SA2s matching the bridges.
      // Search the GeoJSON loaded separately as `features`, as Mapbox does not
      // support searching for features which aren't currently in view.
      connectedFeatures = this.props.features
        .filter(f => bridges
          .some(b => b === Number(f.properties.SA2_MAIN16)))

      // get rid of the repeated features in the connectedFeatures array
      connectedFeatures.forEach((f) => {
        // For each feature, update its 'highlight' state
        const featureId = f.properties.SA2_MAIN16
        this.map.setFeatureState(
          {
            source: "sa2",
            id: featureId,
          },
          {
            highlight: true,
          }
        );
        if (!(featureId in featureObj)) {
          featureObj[featureId] = f;
        }
      });

      // Update component state now that our changes are ready.
      this.setState({ connectedFeatures: connectedFeatures });

      // sort the connectedFeatures based on the ranking in bridges
      var featureList = [];
      bridges.forEach((b) => {
        featureList.push(featureObj[b]);
      });

      // create an array of center coordinates of each SA2 region
      featureList.forEach((ft, i) => {
        var destination = turf.centerOfMass(ft).geometry.coordinates;
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

      const animate = function animate(featureIdx, cntr, point, route, pointID) {
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.
        if (
          cntr >=
          route.features[featureIdx].geometry.coordinates.length - 1
        ) {
          return;
        }
        var cntrIdx = cntr;
        if (that.props.flowDirection === Constants.FLOW_IN) {
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
    }
  };
  
  render() {
    return <div id="map" ref={this.mapRef} className="map" />
  }
};

function mapStateToProps(state) {
  return {
    features: state.features,
    geojsonURL: state.geojsonURL,
    active: state.active,
    select: state.select,
    flowDirection: state.flowDirection,
    searchBarInfo: state.searchBarInfo,
    sidebarOpen: state.sidebarOpen,
    selectedFeature: state.selectedFeature,
    highlightedFeature: state.highlightedFeature,
  };
}

Map = connect(mapStateToProps)(Map);

export default Map;
