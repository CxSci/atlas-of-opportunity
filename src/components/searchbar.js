import React from "react";

import { connect } from "react-redux";
import { setSearchBarInfo } from "../redux/action-creators";

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q";

let SearchBar = class SearchBar extends React.Component {
  geocoder;

  componentDidMount() {
    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      types: "neighborhood, locality, address",
      countries: "au",
      mapboxgl: mapboxgl,
    });

    if (document.getElementById("geocoder")) {
      document.getElementById("geocoder").appendChild(this.geocoder.onAdd());
    }

    this.geocoder.on("result", this.onMapSearch);
  }

  onMapSearch = (e) => {
    setSearchBarInfo(e.result.center);
  };

  render() {
    // Style components
    const search = {
      position: 'absolute',
      top: "100px",
      right: "24px",
    };

    return (
        <div id="geocoder" style={search}></div>
    );
  }
};

function searchbarStateToProps(state) {
  return {
    data: state.data,
    active: state.active,
    select: state.select,
    modal: state.modal,
    flowDirection: state.flowDirection,
  };
}

SearchBar = connect(searchbarStateToProps)(SearchBar);

export default SearchBar;
