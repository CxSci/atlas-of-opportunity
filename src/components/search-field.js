import React, { useState, useMemo } from "react"
// import PropTypes from "prop-types"
import { useCombobox } from "downshift"
import { usePopper } from "react-popper"

import { sameWidthModifier } from "../utils/popper-modifiers"
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
  marginLeft: "10px",
  width: '305px',
}

const fieldStyle = {
  background: 'white',
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25), 0px -1px 0px rgba(0, 0, 0, 0.1)",
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
  maxHeight: "400px",
  overflowY: "auto",
  background: "white",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25), 0px -1px 0px rgba(0, 0, 0, 0.1)",
  borderRadius: "5px",
  marginTop: "10px",
}

const itemStyle = {
  padding: "12px 15px"
}

const primaryStyle = {
  fontSize: 16,
  fontWeight: 500
}

const secondaryStyle = {
  color: "#333333",
  fontSize: 14,
  marginTop: 6,
}

// TODO: replace this with a prop on SearchField
const items = [{primary: "Adelaide", secondary: "Adelaide, SA, Australia"}, {primary: "North Adelaide", secondary: "North Adelaide, SA, Australia"}, {primary: "Adelaide Hills", secondary: "Adelaide Hills, SA, Australia"}, {primary: "Aldgate - Stirling", secondary: "Aldgate - Stirling, SA, Australia"}, {primary: "Hahndorf - Echunga", secondary: "Hahndorf - Echunga, SA, Australia"}, {primary: "Lobethal - Woodside", secondary: "Lobethal - Woodside, SA, Australia"}, {primary: "Mount Barker", secondary: "Mount Barker, SA, Australia"}, {primary: "Mount Barker Region", secondary: "Mount Barker Region, SA, Australia"}, {primary: "Nairne", secondary: "Nairne, SA, Australia"}, {primary: "Uraidla - Summertown", secondary: "Uraidla - Summertown, SA, Australia"}, {primary: "Burnside - Wattle Park", secondary: "Burnside - Wattle Park, SA, Australia"}, {primary: "Glenside - Beaumont", secondary: "Glenside - Beaumont, SA, Australia"}, {primary: "Toorak Gardens", secondary: "Toorak Gardens, SA, Australia"}, {primary: "Athelstone", secondary: "Athelstone, SA, Australia"}, {primary: "Paradise - Newton", secondary: "Paradise - Newton, SA, Australia"}, {primary: "Rostrevor - Magill", secondary: "Rostrevor - Magill, SA, Australia"}, {primary: "Norwood (SA)", secondary: "Norwood (SA), SA, Australia"}, {primary: "Payneham - Felixstow", secondary: "Payneham - Felixstow, SA, Australia"}, {primary: "St Peters - Marden", secondary: "St Peters - Marden, SA, Australia"}, {primary: "Nailsworth - Broadview", secondary: "Nailsworth - Broadview, SA, Australia"}, {primary: "Prospect", secondary: "Prospect, SA, Australia"}, {primary: "Walkerville", secondary: "Walkerville, SA, Australia"}, {primary: "Goodwood - Millswood", secondary: "Goodwood - Millswood, SA, Australia"}, {primary: "Unley - Parkside", secondary: "Unley - Parkside, SA, Australia"}, {primary: "Gawler - North", secondary: "Gawler - North, SA, Australia"}, {primary: "Gawler - South", secondary: "Gawler - South, SA, Australia"}, {primary: "Lewiston - Two Wells", secondary: "Lewiston - Two Wells, SA, Australia"}, {primary: "Craigmore - Blakeview", secondary: "Craigmore - Blakeview, SA, Australia"}, {primary: "Davoren Park", secondary: "Davoren Park, SA, Australia"}, {primary: "Elizabeth", secondary: "Elizabeth, SA, Australia"}, {primary: "Elizabeth East", secondary: "Elizabeth East, SA, Australia"}, {primary: "Munno Para West - Angle Vale", secondary: "Munno Para West - Angle Vale, SA, Australia"}, {primary: "One Tree Hill", secondary: "One Tree Hill, SA, Australia"}, {primary: "Smithfield - Elizabeth North", secondary: "Smithfield - Elizabeth North, SA, Australia"}, {primary: "Virginia - Waterloo Corner", secondary: "Virginia - Waterloo Corner, SA, Australia"}, {primary: "Enfield - Blair Athol", secondary: "Enfield - Blair Athol, SA, Australia"}, {primary: "Northgate - Oakden - Gilles Plains", secondary: "Northgate - Oakden - Gilles Plains, SA, Australia"}, {primary: "Windsor Gardens", secondary: "Windsor Gardens, SA, Australia"}, {primary: "Dry Creek - North", secondary: "Dry Creek - North, SA, Australia"}, {primary: "Ingle Farm", secondary: "Ingle Farm, SA, Australia"}, {primary: "Para Hills", secondary: "Para Hills, SA, Australia"}, {primary: "Parafield", secondary: "Parafield, SA, Australia"}, {primary: "Parafield Gardens", secondary: "Parafield Gardens, SA, Australia"}, {primary: "Paralowie", secondary: "Paralowie, SA, Australia"}, {primary: "Salisbury", secondary: "Salisbury, SA, Australia"}, {primary: "Salisbury East", secondary: "Salisbury East, SA, Australia"}, {primary: "Salisbury North", secondary: "Salisbury North, SA, Australia"}, {primary: "Mawson Lakes - Globe Derby Park", secondary: "Mawson Lakes - Globe Derby Park, SA, Australia"}, {primary: "Pooraka - Cavan", secondary: "Pooraka - Cavan, SA, Australia"}, {primary: "Golden Grove", secondary: "Golden Grove, SA, Australia"}, {primary: "Greenwith", secondary: "Greenwith, SA, Australia"}, {primary: "Highbury - Dernancourt", secondary: "Highbury - Dernancourt, SA, Australia"}, {primary: "Hope Valley - Modbury", secondary: "Hope Valley - Modbury, SA, Australia"}, {primary: "Modbury Heights", secondary: "Modbury Heights, SA, Australia"}, {primary: "Redwood Park", secondary: "Redwood Park, SA, Australia"}, {primary: "St Agnes - Ridgehaven", secondary: "St Agnes - Ridgehaven, SA, Australia"}, {primary: "Brighton (SA)", secondary: "Brighton (SA), SA, Australia"}, {primary: "Glenelg (SA)", secondary: "Glenelg (SA), SA, Australia"}, {primary: "Edwardstown", secondary: "Edwardstown, SA, Australia"}, {primary: "Hallett Cove", secondary: "Hallett Cove, SA, Australia"}, {primary: "Marino - Seaview Downs", secondary: "Marino - Seaview Downs, SA, Australia"}, {primary: "Mitchell Park", secondary: "Mitchell Park, SA, Australia"}, {primary: "Morphettville", secondary: "Morphettville, SA, Australia"}, {primary: "Sheidow Park - Trott Park", secondary: "Sheidow Park - Trott Park, SA, Australia"}, {primary: "Warradale", secondary: "Warradale, SA, Australia"}, {primary: "Belair", secondary: "Belair, SA, Australia"}, {primary: "Bellevue Heights", secondary: "Bellevue Heights, SA, Australia"}, {primary: "Blackwood", secondary: "Blackwood, SA, Australia"}, {primary: "Colonel Light Gardens", secondary: "Colonel Light Gardens, SA, Australia"}, {primary: "Mitcham (SA)", secondary: "Mitcham (SA), SA, Australia"}, {primary: "Panorama", secondary: "Panorama, SA, Australia"}, {primary: "Aberfoyle Park", secondary: "Aberfoyle Park, SA, Australia"}, {primary: "Aldinga", secondary: "Aldinga, SA, Australia"}, {primary: "Christie Downs", secondary: "Christie Downs, SA, Australia"}, {primary: "Christies Beach", secondary: "Christies Beach, SA, Australia"}, {primary: "Clarendon", secondary: "Clarendon, SA, Australia"}, {primary: "Coromandel Valley", secondary: "Coromandel Valley, SA, Australia"}, {primary: "Flagstaff Hill", secondary: "Flagstaff Hill, SA, Australia"}, {primary: "Hackham - Onkaparinga Hills", secondary: "Hackham - Onkaparinga Hills, SA, Australia"}, {primary: "Hackham West - Huntfield Heights", secondary: "Hackham West - Huntfield Heights, SA, Australia"}, {primary: "Happy Valley", secondary: "Happy Valley, SA, Australia"}, {primary: "Happy Valley Reservoir", secondary: "Happy Valley Reservoir, SA, Australia"}, {primary: "Lonsdale", secondary: "Lonsdale, SA, Australia"}, {primary: "McLaren Vale", secondary: "McLaren Vale, SA, Australia"}, {primary: "Morphett Vale - East", secondary: "Morphett Vale - East, SA, Australia"}, {primary: "Morphett Vale - West", secondary: "Morphett Vale - West, SA, Australia"}, {primary: "Reynella", secondary: "Reynella, SA, Australia"}, {primary: "Seaford (SA)", secondary: "Seaford (SA), SA, Australia"}, {primary: "Willunga", secondary: "Willunga, SA, Australia"}, {primary: "Woodcroft", secondary: "Woodcroft, SA, Australia"}, {primary: "Beverley", secondary: "Beverley, SA, Australia"}, {primary: "Flinders Park", secondary: "Flinders Park, SA, Australia"}, {primary: "Henley Beach", secondary: "Henley Beach, SA, Australia"}, {primary: "Hindmarsh - Brompton", secondary: "Hindmarsh - Brompton, SA, Australia"}, {primary: "Royal Park - Hendon - Albert Park", secondary: "Royal Park - Hendon - Albert Park, SA, Australia"}, {primary: "Seaton - Grange", secondary: "Seaton - Grange, SA, Australia"}, {primary: "West Lakes", secondary: "West Lakes, SA, Australia"}, {primary: "Woodville - Cheltenham", secondary: "Woodville - Cheltenham, SA, Australia"}, {primary: "Dry Creek - South", secondary: "Dry Creek - South, SA, Australia"}, {primary: "Largs Bay - Semaphore", secondary: "Largs Bay - Semaphore, SA, Australia"}, {primary: "North Haven", secondary: "North Haven, SA, Australia"}, {primary: "Port Adelaide", secondary: "Port Adelaide, SA, Australia"}, {primary: "The Parks", secondary: "The Parks, SA, Australia"}, {primary: "Torrens Island", secondary: "Torrens Island, SA, Australia"}, {primary: "Adelaide Airport", secondary: "Adelaide Airport, SA, Australia"}, {primary: "Fulham", secondary: "Fulham, SA, Australia"}, {primary: "Lockleys", secondary: "Lockleys, SA, Australia"}, {primary: "Plympton", secondary: "Plympton, SA, Australia"}, {primary: "Richmond (SA)", secondary: "Richmond (SA), SA, Australia"}, {primary: "West Beach", secondary: "West Beach, SA, Australia"}, {primary: "Barossa - Angaston", secondary: "Barossa - Angaston, SA, Australia"}, {primary: "Light", secondary: "Light, SA, Australia"}, {primary: "Lyndoch", secondary: "Lyndoch, SA, Australia"}, {primary: "Mallala", secondary: "Mallala, SA, Australia"}, {primary: "Nuriootpa", secondary: "Nuriootpa, SA, Australia"}, {primary: "Tanunda", secondary: "Tanunda, SA, Australia"}, {primary: "Clare", secondary: "Clare, SA, Australia"}, {primary: "Gilbert Valley", secondary: "Gilbert Valley, SA, Australia"}, {primary: "Goyder", secondary: "Goyder, SA, Australia"}, {primary: "Wakefield - Barunga West", secondary: "Wakefield - Barunga West, SA, Australia"}, {primary: "Jamestown", secondary: "Jamestown, SA, Australia"}, {primary: "Peterborough - Mount Remarkable", secondary: "Peterborough - Mount Remarkable, SA, Australia"}, {primary: "Port Pirie", secondary: "Port Pirie, SA, Australia"}, {primary: "Port Pirie Region", secondary: "Port Pirie Region, SA, Australia"}, {primary: "Kadina", secondary: "Kadina, SA, Australia"}, {primary: "Moonta", secondary: "Moonta, SA, Australia"}, {primary: "Wallaroo", secondary: "Wallaroo, SA, Australia"}, {primary: "Yorke Peninsula - North", secondary: "Yorke Peninsula - North, SA, Australia"}, {primary: "Yorke Peninsula - South", secondary: "Yorke Peninsula - South, SA, Australia"}, {primary: "Ceduna", secondary: "Ceduna, SA, Australia"}, {primary: "Eyre Peninsula", secondary: "Eyre Peninsula, SA, Australia"}, {primary: "Kimba - Cleve - Franklin Harbour", secondary: "Kimba - Cleve - Franklin Harbour, SA, Australia"}, {primary: "Le Hunte - Elliston", secondary: "Le Hunte - Elliston, SA, Australia"}, {primary: "Port Lincoln", secondary: "Port Lincoln, SA, Australia"}, {primary: "West Coast (SA)", secondary: "West Coast (SA), SA, Australia"}, {primary: "Western", secondary: "Western, SA, Australia"}, {primary: "Whyalla", secondary: "Whyalla, SA, Australia"}, {primary: "Whyalla - North", secondary: "Whyalla - North, SA, Australia"}, {primary: "APY Lands", secondary: "APY Lands, SA, Australia"}, {primary: "Coober Pedy", secondary: "Coober Pedy, SA, Australia"}, {primary: "Quorn - Lake Gilles", secondary: "Quorn - Lake Gilles, SA, Australia"}, {primary: "Outback", secondary: "Outback, SA, Australia"}, {primary: "Port Augusta", secondary: "Port Augusta, SA, Australia"}, {primary: "Roxby Downs", secondary: "Roxby Downs, SA, Australia"}, {primary: "Goolwa - Port Elliot", secondary: "Goolwa - Port Elliot, SA, Australia"}, {primary: "Kangaroo Island", secondary: "Kangaroo Island, SA, Australia"}, {primary: "Strathalbyn", secondary: "Strathalbyn, SA, Australia"}, {primary: "Strathalbyn Region", secondary: "Strathalbyn Region, SA, Australia"}, {primary: "Victor Harbor", secondary: "Victor Harbor, SA, Australia"}, {primary: "Yankalilla", secondary: "Yankalilla, SA, Australia"}, {primary: "Grant", secondary: "Grant, SA, Australia"}, {primary: "Kingston - Robe", secondary: "Kingston - Robe, SA, Australia"}, {primary: "Millicent", secondary: "Millicent, SA, Australia"}, {primary: "Naracoorte", secondary: "Naracoorte, SA, Australia"}, {primary: "Naracoorte Region", secondary: "Naracoorte Region, SA, Australia"}, {primary: "Penola", secondary: "Penola, SA, Australia"}, {primary: "Tatiara", secondary: "Tatiara, SA, Australia"}, {primary: "Wattle Range", secondary: "Wattle Range, SA, Australia"}, {primary: "Mount Gambier - East", secondary: "Mount Gambier - East, SA, Australia"}, {primary: "Mount Gambier - West", secondary: "Mount Gambier - West, SA, Australia"}, {primary: "Barmera", secondary: "Barmera, SA, Australia"}, {primary: "Berri", secondary: "Berri, SA, Australia"}, {primary: "Karoonda - Lameroo", secondary: "Karoonda - Lameroo, SA, Australia"}, {primary: "Loxton", secondary: "Loxton, SA, Australia"}, {primary: "Loxton Region", secondary: "Loxton Region, SA, Australia"}, {primary: "Mannum", secondary: "Mannum, SA, Australia"}, {primary: "Murray Bridge", secondary: "Murray Bridge, SA, Australia"}, {primary: "Murray Bridge Region", secondary: "Murray Bridge Region, SA, Australia"}, {primary: "Renmark", secondary: "Renmark, SA, Australia"}, {primary: "Renmark Region", secondary: "Renmark Region, SA, Australia"}, {primary: "The Coorong", secondary: "The Coorong, SA, Australia"}, {primary: "Waikerie", secondary: "Waikerie, SA, Australia"}, {primary: "Migratory - Offshore - Shipping (SA)", secondary: "Migratory - Offshore - Shipping (SA), SA, Australia"}, {primary: "No usual address (SA)", secondary: "No usual address (SA), SA, Australia"} ]

function SearchField() {
  // Set up popper-js
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    // Set the popper's width to match the search field
    modifiers: useMemo(
      () => [sameWidthModifier], []
    ),
    placement: "bottom-start"
  })

  // Default to showing all of the available options
  const [inputItems, setInputItems] = useState(items)
  const itemToString = item => (item ? item.primary : '')
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
    itemToString,
    onSelectedItemChange: ({ selectedItem }) => {
      console.log(selectedItem)
    },
    onInputValueChange: ({ inputValue }) => {
      setInputItems(items.filter(
        item => item.secondary.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
      ))
    }
  })

  return (
    <div className="searchContainer" ref={setReferenceElement} style={containerStyle}>
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
        <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
          <ul {...getMenuProps()} hidden={!isOpen} style={menuStyles}>
            {isOpen &&
              inputItems.map((item, index) => (
                <li
                  style={ {...itemStyle, 
                    ...(highlightedIndex === index
                      ? { backgroundColor: '#f2f2f2' }
                      : {})}
                  }
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <div className="primary" style={primaryStyle}>{item.primary}</div>
                  <div className="secondary" style={secondaryStyle}>{item.secondary}</div>
                </li>
              ))}
          </ul>
        </div>
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
