import React from "react";
import { setSelect } from "../redux/action-creators";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";

mapboxgl.accessToken =
  "pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q";

let SegregationMap = class SegregationMap extends React.Component {
  mapRef = React.createRef();
  map;

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
  };

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: "mapbox://styles/xmzhu/ckbqk0jmp4o041ipd7wkb39fw",
      center: this.props.modal ? [121, -26.5] : [138.5, -34.9],
      zoom: this.props.modal ? 3.5 : 9,
    });

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
      this.map.on("mousemove", "sa2-fills", (e) => {
        if (e.features.length > 0) {
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
      });

      this.map.on("click", "sa2-fills", this.onMapClick);
    });
  }

  componentDidUpdate(prevProps) {}

  onMapClick = (e) => {
    let prevSA2 = this.state.clickedSA2;
    let clickedSA2 = e.features[0]; //properties.name;
    // Ignore clicks on the active SA2.
    if (
      !prevSA2 ||
      clickedSA2.properties.SA2_NAME16 !== prevSA2.properties.SA2_NAME16
    ) {
      if (prevSA2 !== null) {
        this.map.setFeatureState(
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
    this.map.setFeatureState(
      {
        source: "sa2",
        id: clickedSA2.id,
      },
      {
        click: true,
      }
    );
    this.setState({ ...this.state, clickedSA2: clickedSA2 });

    let sa2_properties = {
      sa2_name: clickedSA2.properties.SA2_NAME16,
      population: toCommas(clickedSA2.properties.persons_num),
      income: "$" + toCommas(clickedSA2.properties.median_aud),
      quartile: clickedSA2.properties.quartile,
      fq1: clickedSA2.properties.fq1,
      fq2: clickedSA2.properties.fq2,
      fq3: clickedSA2.properties.fq3,
      fq4: clickedSA2.properties.fq4,
      inequality: clickedSA2.properties.inequality,
      ggp: clickedSA2.properties.income_diversity,
      jr: clickedSA2.properties.bridge_diversity,
      bgi: clickedSA2.properties.bsns_growth_rate,
      sa1_codes: clickedSA2.properties.SA1_7DIGITCODE_LIST,
      isDefault: false,
    };

    setSelect(sa2_properties);

    // Update component state now that our changes are ready.
    this.setState({ clickedSA2: clickedSA2 });
  };

  shouldComponentUpdate() {
    if (this.props.modal === true) {
      this.map.flyTo({
        center: [138.7, -34.9],
        zoom: 9,
        speed: 0.8,
      });
    }
    return true;
  }

  render() {
    return <div ref={this.mapRef} className="absolute top right left bottom" />;
  }
};

function mapStateToProps(state) {
  return {
    data: state.data,
    active: state.active,
    select: state.select,
    modal: state.modal,
    flowDirection: state.flowDirection,
  };
}

function toCommas(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

SegregationMap = connect(mapStateToProps)(SegregationMap);

export default SegregationMap;
