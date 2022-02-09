import React from "react";
import PropTypes from "prop-types";
// Add '!' so production builds work. See: https://docs.mapbox.com/mapbox-gl-js/api/#excluding-gl-js-explicitly-from-transpilation
// eslint-disable-next-line
import mapboxgl from "!mapbox-gl";
import { connect } from "react-redux";
import {
  setSelectedFeature,
  setSavedMapPosition,
  setMapType,
} from "../redux/action-creators";
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
    className: "floating-popup",
  });
  clickedPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: "floating-popup",
  });
  cntr0Popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: "floating-popup",
  });
  cntr1Popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: "floating-popup",
  });
  cntr2Popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: "floating-popup",
  });
  markerRadius = 4;
  detailPopup = new mapboxgl.Popup({
    closeButton: true, 
    className: "detail-popup",
    // Ensure .mapboxgl-popup-tip doesn't overlap the marker it points to
    offset: {
      'top': [0, this.markerRadius],
      'top-left': [this.markerRadius, this.markerRadius],
      'top-right': [-this.markerRadius, this.markerRadius],
      'bottom': [0, -this.markerRadius],
      'bottom-left': [this.markerRadius, -this.markerRadius],
      'bottom-right': [-this.markerRadius, -this.markerRadius],
      'left': [this.markerRadius, 0],
      'right': [-this.markerRadius, 0],
    }
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
    activeLayer: PropTypes.object.isRequired,
    mapLayers: PropTypes.object.isRequired,
    flowDirection: PropTypes.string.isRequired,
    savedMapPosition: PropTypes.object,
    searchBarInfo: PropTypes.arrayOf(PropTypes.number),
    sidebarOpen: PropTypes.bool.isRequired,
    selectedFeature: PropTypes.object,
    comparisonFeatures: PropTypes.array,
    poiFeatures: PropTypes.array,
    highlightedFeature: PropTypes.object,
    mini: PropTypes.bool,
  };

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      bounds: [
        [129, -38],
        [141, -26],
      ],
      // 70px padding around initial viewport, with an extra 310 on the left
      // to account for <WelcomeDialog />.
      // TODO: Calculate width of WelcomeDialog at runtime instead of
      //       hardcoding it here.
      fitBoundsOptions: this.props.mini
        ? undefined
        : { padding: { top: 70, bottom: 70, left: 70 + 310, right: 70 } },
      interactive: !this.props.mini,
    });

    this.map.resize();

    if (!this.props.mini) {
      // Look at the same place as last time if that was saved
      if (this.props.savedMapPosition) {
        const { center, zoom, pitch, bearing } = this.props.savedMapPosition;
        this.map.setCenter(center);
        this.map.setZoom(zoom);
        this.map.setPitch(pitch);
        this.map.setBearing(bearing);
      }

      // zoom buttons
      var controls = new mapboxgl.NavigationControl({
        showCompass: true,
        visualizePitch: true,
      });
      this.map.addControl(controls, "bottom-right");
    }

    this.map.on("load", () => {
      this.map.addSource("sa2", {
        type: "geojson",
        data: this.props.geojsonURL,
        promoteId: "SA2_MAIN16",
      });

      this.map.addSource("business", {
        type: "geojson",
        data: { type: "FeatureCollection", features: this.props.poiFeatures },
        cluster: true,
        clusterMaxZoom: 11, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      if (!this.props.mini) {
        this.map.addLayer({
          id: "sa2-fills",
          type: "fill",
          source: "sa2",
          sourceLayer: "original",
          layout: {},
          paint: {
            "fill-color": {
              property: this.props.activeLayer.property,
              stops: this.props.activeLayer.stops,
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
      }

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
            "#fef4e1",
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

      // Source and layers for comparison-mode mini map
      if (this.props.mini) {
        this.map.addSource("sa2-comp", {
          type: "geojson",
          data: null,
          promoteId: "SA2_MAIN16",
        });
        this.map.addLayer({
          id: "sa2-fills",
          type: "fill",
          source: "sa2-comp",
          sourceLayer: "original",
          layout: {},
          paint: {
            "fill-color": {
              property: this.props.mapLayers[Constants.MAP_TYPE.GROWTH].property,
              stops: this.props.mapLayers[Constants.MAP_TYPE.GROWTH].stops,
            },
            "fill-opacity": 0.8,
          },
        });
        this.map.addLayer({
          id: "sa2-borders-comp",
          type: "line",
          source: "sa2-comp",
          sourceLayer: "original",
          layout: {},
          paint: {
            "line-color": "#FFFFFF",
            "line-width": 2,
            "line-opacity": 1,
          },
        });
      }

      // When the user moves their mouse over the sa2-fill layer, we'll update the
      // feature state for the feature under the mouse.
      // name of sa2-fills appear over the region

      if (!this.props.mini) {
        this.map.on("mousemove", "sa2-fills", (e) => {
          if (e.features.length > 0) {
            this.highlightFeature(e.features[0]);
          }
        });

        // Create clusters on load if selected for initial map loads to business layer
        if (this.props.activeLayer.key === Constants.MAP_TYPE.BUSINESSES) {
          this.drawBusinessClusters()
        }

        // When the mouse leaves the sa2-fill layer, update the feature state of the
        // previously hovered feature.

        this.map.on("mouseleave", "sa2-fills", this.clearFeatureHighlight);

        // Handle clicks on map features
        this.map.on("click", "sa2-fills", this.onMapClick);

        // Handle clicks on clusters
        this.map.on("click", "clusters", this.zoomOnClick);

        // Handle clicks on business points
        this.map.on("click", "unclustered-point", this.pointOnClick);

        // Add hover cursor for clusters
        this.map.on("mouseenter", "clusters", this.setCursorPointer);
        this.map.on("mouseleave", "clusters", this.setCursorNone);

        // Add hover cursor for points
        this.map.on("mouseenter", "unclustered-point", this.setCursorPointer);
        this.map.on("mouseleave", "unclustered-point", this.setCursorNone);

        // Handle map clicks outside of map features
        this.map.on("click", this.onMapClick);
        if (this.props.selectedFeature) {
          this.selectFeature(this.props.selectedFeature);
        }
      } else {
        this.highlightComparisonFeatures(this.props.comparisonFeatures);
      }
    });
  }

  pointOnClick = (e) => {
    var coordinates = e.features[0].geometry.coordinates.slice();

    const properties = e.features[0].properties;

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    this.detailPopup
      .setLngLat(coordinates)
      .setHTML("<div class=\"popup-root\"><p class=\"popup-text-header\"> " + properties.name + "</p><p class=\"popup-text\">" + properties.type + "</p></div>")
      .addTo(this.map);
  };

  setCursorPointer = () => {
    this.map.getCanvas().style.cursor = "pointer";
  };

  setCursorNone = () => {
    this.map.getCanvas().style.cursor = "";
  };

  zoomOnClick = (e) => {
    //Get list of all clusters available
    var features = this.map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    // Get selected cluster id
    var clusterId = features[0].properties.cluster_id;
    // Use the ease effect to slowly zoom/pan into the clicked on cluster
    this.map
      .getSource("business")
      .getClusterExpansionZoom(clusterId, this.easeToFeature(features));
  };

  easeToFeature = (features) => (err, zoom) => {
    if (err) {
      return;
    }

    this.map.easeTo({
      center: features[0].geometry.coordinates,
      zoom: zoom,
    });
  };

  componentWillUnmount() {
    // If this isn't a minimap, remember where the map is looking for later.
    if (!this.props.mini) {
      setSavedMapPosition({
        center: this.map.getCenter(),
        zoom: this.map.getZoom(),
        pitch: this.map.getPitch(),
        bearing: this.map.getBearing(),
      });
    }
    this.map.remove();
    setSelectedFeature(null);
  }

  highlightFeature = (feature) => {
    const prevId = this.state.highlightedFeature?.properties?.SA2_MAIN16;
    const newId = feature?.properties?.SA2_MAIN16;
    if (prevId === newId) {
      return;
    }
    // First, clear any old highlight
    if (this.state.highlightedFeature) {
      this.map.setFeatureState({ source: "sa2", id: prevId }, { hover: false });
    }

    this.setState({ highlightedFeature: feature });

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
  };

  clearFeatureHighlight = () => {
    this.highlightFeature(null);
  };

  resizeMapPinningNortheast = () => {
    // Resize the map without moving its northeast corner
    const oldCorner = this.map.getBounds().getNorthEast();
    this.map.resize();
    let corner = this.map.getBounds().getNorthEast();
    let center = this.map.getCenter();
    let shiftVector = {
      x: corner.lng - oldCorner.lng,
      y: corner.lat - oldCorner.lat,
    };
    let newCenter = new mapboxgl.LngLat(
      center.lng - shiftVector.x,
      center.lat - shiftVector.y
    );
    this.map.setCenter(newCenter);
  };

  highlightComparisonFeatures = (features) => {
    if (features.length <= 0) {
      return;
    }
    const comparisonFeatures = { type: "FeatureCollection", features };
    const [minX, minY, maxX, maxY] = turf.bbox(comparisonFeatures);
    this.map.fitBounds(
      [
        [minX, minY],
        [maxX, maxY],
      ],
      {
        padding: { top: 20, bottom: 40, left: 20, right: 20 },
        animate: false,
      }
    );
    // If sa2-comp doesn't exist then the map hasn't finished loading yet.
    // In that case, ignore this call to highlightComparisonFeatures and let
    // the map's on("load") call it after it has loaded all styles and
    // sources.
    const source = this.map.getSource("sa2-comp");
    if (source) {
      source.setData(comparisonFeatures);
    }
  };

  drawBusinessClusters() {
    if (this.map.getLayer("sa2-fills")) {
      this.map.removeLayer("sa2-fills");
    } 
    if (!this.map.getLayer("clusters")) {
      this.map.addLayer({
        id: "clusters",
        type: "circle",
        source: "business",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });
    }

    //Mapbox uses it's own fonts and doesn't support roboto
    if (!this.map.getLayer("cluster-count")) {
      this.map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "business",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });
    }

    if (!this.map.getLayer("unclustered-point")) {
      this.map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "business",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": this.markerRadius,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    // Mapbox only notices changes to the window's dimensions. Manually resize
    // whenever the sidebar appears or disappears.
    if (
      this.props.sidebarOpen !== prevProps.sidebarOpen ||
      (this.props.selectedFeature !== prevProps.selectedFeature &&
        (!this.props.selectedFeature || !prevProps.selectedFeature)) ||
      (this.props.comparisonFeatures.length !==
        prevProps.comparisonFeatures.length &&
        this.props.comparisonFeatures.length === 0)
    ) {
      // Putting a timeout on this lead to flashes of weirdness and halted map animations.
      this.resizeMapPinningNortheast();
    }

    if (this.props.flowDirection !== prevProps.flowDirection) {
      this.redrawBridges();
    }

    if (this.props.activeLayer.key !== prevProps.activeLayer.key) {
      if (this.props.activeLayer.key === Constants.MAP_TYPE.BUSINESSES && !this.props.mini) {
        this.redrawBridges();
        this.drawBusinessClusters();
      } else {
        if (this.map.getLayer("clusters")) {
          this.map.removeLayer("clusters");
        }
        if (this.map.getLayer("cluster-count")) {
          this.map.removeLayer("cluster-count");
        }
        if (this.map.getLayer("unclustered-point")) { 
          this.map.removeLayer("unclustered-point");
        }

        this.detailPopup.remove();

        if (!this.map.getLayer("sa2-fills")) {
          this.map.addLayer({
            id: "sa2-fills",
            type: "fill",
            source: "sa2",
            sourceLayer: "original",
            layout: {},
            paint: {
              "fill-color": {
                property: this.props.activeLayer.property,
                stops: this.props.activeLayer.stops,
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
          }, "sa2-borders");
        }
        let fillColor = {
          property: this.props.activeLayer.property,
          stops: this.props.activeLayer.stops,
        };

        this.map.setPaintProperty("sa2-fills", "fill-color", fillColor);
      }
    }

    if (this.props.highlightedFeature !== prevProps.highlightedFeature) {
      this.highlightFeature(this.props.highlightedFeature);
    }

    if (this.props.selectedFeature !== prevProps.selectedFeature) {
      this.selectFeature(this.props.selectedFeature);
    }

    if (
      this.props.comparisonFeatures !== prevProps.comparisonFeatures &&
      this.props.mini
    ) {
      this.highlightComparisonFeatures(this.props.comparisonFeatures);
    }
  }

  selectFeature = (feature) => {
    const prevId = this.state.selectedFeature?.properties?.SA2_MAIN16;
    const newId = feature?.properties?.SA2_MAIN16;
    // Skip if the selection hasn't actually changed or if the map isn't fully loaded yet
    if (
      prevId === newId ||
      !this.map.getSource("sa2") ||
      !this.map.isSourceLoaded("sa2")
    ) {
      return;
    } else if (this.props.activeLayer.key !== Constants.MAP_TYPE.BUSINESSES) {
      this.redrawBridges(feature);
    } else {
      setMapType("growth")
    }

    if (feature && (feature.geometry || feature._geometry)) {
      const [minX, minY, maxX, maxY] = turf.bbox(feature);
      this.map.fitBounds(
        [
          [minX, minY],
          [maxX, maxY],
        ],
        {
          maxZoom: 10,
          padding: 100,
          bearing: this.map.getBearing(),
          pitch: this.map.getPitch(),
        }
      );
    }
  };

  onMapClick = (e) => {
    // Ignore clicks that were already consumed by a deeper handler  e.g. if
    // the user clicked on a map feature, ignore the same click event when
    // seen by the overall map.
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();

    let prevSA2 = this.state.selectedFeature;
    let clickedFeature = null;
    let clickedFeatureId = e.features?.[0].properties.SA2_MAIN16;

    if (clickedFeatureId) {
      clickedFeature = this.props.features.find(ft => ft.properties.SA2_MAIN16 === clickedFeatureId);
      // Make sure this feature has a `primary` property for when it becomes
      // selectedFeature, as the search field adds that to its own features and
      // expects passed in features to have the same.
      // TODO: Make SearchField and SASearchField smart enough to handle
      //       features which lack `primary`.
      clickedFeature.properties.primary = clickedFeature.properties.SA2_NAME16;
    }

    // Ignore clicks on the active SA2.
    if (
      !prevSA2 ||
      clickedFeature !== prevSA2 ||
      clickedFeature.properties.SA2_MAIN16 !== prevSA2.properties.SA2_MAIN16
    ) {
      this.redrawBridges(clickedFeature);
      setSelectedFeature(clickedFeature);
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
    /*if (this.map.getLayer("route") !== undefined) {
      this.map.removeLayer("route");
      this.map.removeSource("route");
    }
    if (this.map.getLayer("point") !== undefined) {
      this.map.removeLayer("point");
      this.map.removeSource("point");
    }*/
    //var featureObj = {};
    //var destinationList = [];
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

    this.setState({ selectedFeature: feature });

    // Skip features without geometry, like the two SA2s
    // "Migratory - Offshore - Shipping (SA)" and "No usual address (SA)"
    if (!feature || !(feature.geometry || feature._geometry)) {
      return;
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

    /*if (this.props.activeLayer.key !== Constants.MAP_TYPE.SEGREGATION) {
      // Show the bridges for the selected flow direction {in, out, bi-directional}.
      // flowDirection should be one of "inflow", "outflow", or "bidirectional"
      // e.g. keys = ["inflow_r1", "inflow_r2", "inflow_r3"]
      let keys = this.props.activeLayer.bridgeKeys[this.props.flowDirection];
      // Get bridges and ignore missing values
      // Note that somewhere along the way, Mapbox GL turns GeoJSON properties
      // like {"foo": null} into {"foo": "null"}.
      const bridges = keys
        .map((x) => feature.properties[x])
        .filter(
          (x) =>
            x !== undefined &&
            x !== "null" &&
            typeof x === "number" &&
            isFinite(x)
        );

      // Search map for SA2s matching the bridges.
      // Search the GeoJSON loaded separately as `features`, as Mapbox does not
      // support searching for features which aren't currently in view.
      connectedFeatures = this.props.features.filter((f) =>
        bridges.some((b) => b === Number(f.properties.SA2_MAIN16))
      );

      // get rid of the repeated features in the connectedFeatures array
      connectedFeatures.forEach((f) => {
        // For each feature, update its 'highlight' state
        const featureId = f.properties.SA2_MAIN16;
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

      const animate = function animate(
        featureIdx,
        cntr,
        point,
        route,
        pointID
      ) {
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
      };

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
    }*/
  };

  render() {
    return <div id="map" ref={this.mapRef} className="map" />;
  }
};

function mapStateToProps(state) {
  return {
    features: state.features,
    geojsonURL: state.geojsonURL,
    activeLayer: state.activeLayer,
    mapLayers: state.mapLayers,
    flowDirection: state.flowDirection,
    savedMapPosition: state.savedMapPosition,
    searchBarInfo: state.searchBarInfo,
    sidebarOpen: state.sidebarOpen,
    selectedFeature: state.selectedFeature,
    highlightedFeature: state.highlightedFeature,
    comparisonFeatures: state.comparisonFeatures,
    poiFeatures: state.poiFeatures,
  };
}

Map = connect(mapStateToProps)(Map);

export default Map;
