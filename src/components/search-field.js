import React, { useState } from "react"
// import PropTypes from "prop-types"
import { useCombobox } from "downshift"
// import { usePopper } from "react-popper"

// import { connect } from "react-redux";
// import { setSearchBarInfo } from "../redux/action-creators";
import { ReactComponent as SearchIcon} from "../assets/search-icons/search.svg"
import { ReactComponent as CancelIcon} from "../assets/search-icons/cancel.svg"

// import mapboxgl from "mapbox-gl";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// mapboxgl.accessToken =
//   "pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q";

const containerStyle = {
  // marginTop: "10px",
  marginLeft: "10px",
  width: '305px',
}

const fieldStyle = {
  background: 'white',
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25), 0px -1px 0px rgba(0, 0, 0, 0.1)",
  // height: '40px',
  // border: "1px solid black",
  pointerEvents: "auto",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
}

const inputStyle = {
  background: "transparent",
  margin: 0,
  padding: "0px 15px",
  lineHeight: "40px",
  // height: "100%",
  fontFamily: "Roboto, sans-serif",
  fontSize: 15,
  border: "none",
  flexGrow: 1,
}

const buttonStyle = {
  height: "40px",
  padding: "4px 15px 0 0",
}

const menuStyles = {
  position: "absolute",
  top: "60px",
  left: "10px",
}


function SearchField() {
  const [inputItems] = useState([
    "One",
    "Two",
    "Three",
    "Four",
    ])
  const {
    getComboboxProps,
    getInputProps,
    getItemProps,
    // getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    inputValue,
    isOpen,
    openMenu,
    selectItem,
    // selectedItem,
  } = useCombobox({
    items: inputItems,
    onSelectedItemChange: ({ selectedItem }) => {
      console.log(selectedItem)
    }
  })

  return (
    <div className="searchContainer" style={containerStyle}>
      <div {...getComboboxProps()} className="searchField" style={fieldStyle}>
        {/* <label {...getLabelProps()}>Choose an element:</label> */}
        <input {...getInputProps({
          onFocus: () => {
                  if (!isOpen) {
                    openMenu()
                  }
                },
          placeholder: "Search by suburb or region"
          })}
          style={inputStyle}
        />
        { inputValue === '' ?
          <button
            tabIndex={-1}
            {...getToggleButtonProps()}
            aria-label="toggle menu"
            style={buttonStyle}
          >
            <SearchIcon />
          </button>
          :
          <button
            tabIndex={-1}
            onClick={() => {
              selectItem(null)
            }}
            aria-label="clear selection"
            style={buttonStyle}
          >
            <CancelIcon />
          </button>
        }
        <ul {...getMenuProps()} style={menuStyles}>
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                style={
                  highlightedIndex === index
                    ? { backgroundColor: '#bde4ff' }
                    : {}
                }
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

// let SearchBar = class SearchBar extends React.Component {
//   geocoder;

//   componentDidMount() {
//     this.geocoder = new MapboxGeocoder({
//       accessToken: mapboxgl.accessToken,
//       types: "neighborhood, locality, address",
//       countries: "au",
//       mapboxgl: mapboxgl,
//     });

//     if (document.getElementById("geocoder")) {
//       document.getElementById("geocoder").appendChild(this.geocoder.onAdd());
//     }

//     this.geocoder.on("result", this.onMapSearch);
//   }

//   onMapSearch = (e) => {
//     setSearchBarInfo(e.result.center);
//   };

//   render() {
//     // Style components
//     const search = {
//       position: "absolute",
//       top: "12px",
//       left: "12px",
//     };

//     return (
//         <div id="geocoder" style={search}></div>
//     );
//   }
// };

// function searchbarStateToProps(state) {
//   return {
//     data: state.data,
//     active: state.active,
//     select: state.select,
//     flowDirection: state.flowDirection,
//   };
// }

// SearchBar = connect(searchbarStateToProps)(SearchBar);

export default SearchField;
