import React, { useState, useMemo } from "react"
// import PropTypes from "prop-types"
import { useCombobox } from "downshift"
import { usePopper } from "react-popper"

import { sameWidthModifier } from "../utils/popper-modifiers"
// import { connect } from "react-redux";
// import { setSearchBarInfo } from "../redux/action-creators";
import { ReactComponent as SearchIcon} from "../assets/search-icons/search.svg"
import { ReactComponent as CancelIcon} from "../assets/search-icons/cancel.svg"

import MapboxClient from "@mapbox/mapbox-sdk"
import MapboxGeocoder from "@mapbox/mapbox-sdk/services/geocoding"

const accessToken =
  "pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q";

// TODO: Lift all of this styling into a separate file.
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

const geocodingClient = () => {
  const client = MapboxClient({
    accessToken: accessToken
  })
  const geocoder = MapboxGeocoder(client)
  return geocoder
}

const forwardGeocode = (geocoder, query, callback) => {
  const config = {
    query: query,
    // mode: "mapbox.places",
    countries: ["AU"],
    // proximity: coordinates,
    types: [
      "postcode", "district", "place", "locality"//, "neighborhood", "address"
    ],
    // Restrict search to South Australia
    bbox: [
      129.001337, -38.062603,
      141.002956, -25.996146
    ],
    limit: 5,
  }
  geocoder.forwardGeocode(config).send()
    .then(response => {
      if ("features" in response.body) {
        console.log(response.body)
        const features = response.body.features.map((f) => {
          return {
            primary: f.text,
            secondary: f.place_name,
            coordinates: f.center,
            relevance: f.relevance,
          }
        })
        callback(features)
      }
    })
}

// TODO: replace this with a prop on SearchField
let items = [{primary: "Adelaide"}, {primary: "North Adelaide"}, {primary: "Adelaide Hills"}, {primary: "Aldgate - Stirling"}, {primary: "Hahndorf - Echunga"}, {primary: "Lobethal - Woodside"}, {primary: "Mount Barker"}, {primary: "Mount Barker Region"}, {primary: "Nairne"}, {primary: "Uraidla - Summertown"}, {primary: "Burnside - Wattle Park"}, {primary: "Glenside - Beaumont"}, {primary: "Toorak Gardens"}, {primary: "Athelstone"}, {primary: "Paradise - Newton"}, {primary: "Rostrevor - Magill"}, {primary: "Norwood (SA)"}, {primary: "Payneham - Felixstow"}, {primary: "St Peters - Marden"}, {primary: "Nailsworth - Broadview"}, {primary: "Prospect"}, {primary: "Walkerville"}, {primary: "Goodwood - Millswood"}, {primary: "Unley - Parkside"}, {primary: "Gawler - North"}, {primary: "Gawler - South"}, {primary: "Lewiston - Two Wells"}, {primary: "Craigmore - Blakeview"}, {primary: "Davoren Park"}, {primary: "Elizabeth"}, {primary: "Elizabeth East"}, {primary: "Munno Para West - Angle Vale"}, {primary: "One Tree Hill"}, {primary: "Smithfield - Elizabeth North"}, {primary: "Virginia - Waterloo Corner"}, {primary: "Enfield - Blair Athol"}, {primary: "Northgate - Oakden - Gilles Plains"}, {primary: "Windsor Gardens"}, {primary: "Dry Creek - North"}, {primary: "Ingle Farm"}, {primary: "Para Hills"}, {primary: "Parafield"}, {primary: "Parafield Gardens"}, {primary: "Paralowie"}, {primary: "Salisbury"}, {primary: "Salisbury East"}, {primary: "Salisbury North"}, {primary: "Mawson Lakes - Globe Derby Park"}, {primary: "Pooraka - Cavan"}, {primary: "Golden Grove"}, {primary: "Greenwith"}, {primary: "Highbury - Dernancourt"}, {primary: "Hope Valley - Modbury"}, {primary: "Modbury Heights"}, {primary: "Redwood Park"}, {primary: "St Agnes - Ridgehaven"}, {primary: "Brighton (SA)"}, {primary: "Glenelg (SA)"}, {primary: "Edwardstown"}, {primary: "Hallett Cove"}, {primary: "Marino - Seaview Downs"}, {primary: "Mitchell Park"}, {primary: "Morphettville"}, {primary: "Sheidow Park - Trott Park"}, {primary: "Warradale"}, {primary: "Belair"}, {primary: "Bellevue Heights"}, {primary: "Blackwood"}, {primary: "Colonel Light Gardens"}, {primary: "Mitcham (SA)"}, {primary: "Panorama"}, {primary: "Aberfoyle Park"}, {primary: "Aldinga"}, {primary: "Christie Downs"}, {primary: "Christies Beach"}, {primary: "Clarendon"}, {primary: "Coromandel Valley"}, {primary: "Flagstaff Hill"}, {primary: "Hackham - Onkaparinga Hills"}, {primary: "Hackham West - Huntfield Heights"}, {primary: "Happy Valley"}, {primary: "Happy Valley Reservoir"}, {primary: "Lonsdale"}, {primary: "McLaren Vale"}, {primary: "Morphett Vale - East"}, {primary: "Morphett Vale - West"}, {primary: "Reynella"}, {primary: "Seaford (SA)"}, {primary: "Willunga"}, {primary: "Woodcroft"}, {primary: "Beverley"}, {primary: "Flinders Park"}, {primary: "Henley Beach"}, {primary: "Hindmarsh - Brompton"}, {primary: "Royal Park - Hendon - Albert Park"}, {primary: "Seaton - Grange"}, {primary: "West Lakes"}, {primary: "Woodville - Cheltenham"}, {primary: "Dry Creek - South"}, {primary: "Largs Bay - Semaphore"}, {primary: "North Haven"}, {primary: "Port Adelaide"}, {primary: "The Parks"}, {primary: "Torrens Island"}, {primary: "Adelaide Airport"}, {primary: "Fulham"}, {primary: "Lockleys"}, {primary: "Plympton"}, {primary: "Richmond (SA)"}, {primary: "West Beach"}, {primary: "Barossa - Angaston"}, {primary: "Light"}, {primary: "Lyndoch"}, {primary: "Mallala"}, {primary: "Nuriootpa"}, {primary: "Tanunda"}, {primary: "Clare"}, {primary: "Gilbert Valley"}, {primary: "Goyder"}, {primary: "Wakefield - Barunga West"}, {primary: "Jamestown"}, {primary: "Peterborough - Mount Remarkable"}, {primary: "Port Pirie"}, {primary: "Port Pirie Region"}, {primary: "Kadina"}, {primary: "Moonta"}, {primary: "Wallaroo"}, {primary: "Yorke Peninsula - North"}, {primary: "Yorke Peninsula - South"}, {primary: "Ceduna"}, {primary: "Eyre Peninsula"}, {primary: "Kimba - Cleve - Franklin Harbour"}, {primary: "Le Hunte - Elliston"}, {primary: "Port Lincoln"}, {primary: "West Coast (SA)"}, {primary: "Western"}, {primary: "Whyalla"}, {primary: "Whyalla - North"}, {primary: "APY Lands"}, {primary: "Coober Pedy"}, {primary: "Quorn - Lake Gilles"}, {primary: "Outback"}, {primary: "Port Augusta"}, {primary: "Roxby Downs"}, {primary: "Goolwa - Port Elliot"}, {primary: "Kangaroo Island"}, {primary: "Strathalbyn"}, {primary: "Strathalbyn Region"}, {primary: "Victor Harbor"}, {primary: "Yankalilla"}, {primary: "Grant"}, {primary: "Kingston - Robe"}, {primary: "Millicent"}, {primary: "Naracoorte"}, {primary: "Naracoorte Region"}, {primary: "Penola"}, {primary: "Tatiara"}, {primary: "Wattle Range"}, {primary: "Mount Gambier - East"}, {primary: "Mount Gambier - West"}, {primary: "Barmera"}, {primary: "Berri"}, {primary: "Karoonda - Lameroo"}, {primary: "Loxton"}, {primary: "Loxton Region"}, {primary: "Mannum"}, {primary: "Murray Bridge"}, {primary: "Murray Bridge Region"}, {primary: "Renmark"}, {primary: "Renmark Region"}, {primary: "The Coorong"}, {primary: "Waikerie"}]
items = items.sort((a, b) => a.primary.localeCompare(b.primary))

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

  // Set up downshift-js combobox / autocomplete
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
    // onSelectedItemChange: ({ selectedItem }) => {
    //   console.log(selectedItem)
    // },
    onInputValueChange: ({ inputValue }) => {
      if (inputValue === '') {
        setInputItems(items)
      } else {
        forwardGeocode(geocoder, inputValue, (features) => {
          setInputItems([
            // Limit local items to ones containing the query
            ...items.filter(item => item.primary.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1),
            ...features]
            .sort((a, b) => (
              // First, local items get priority
              (a.coordinates ?? []).length - (b.coordinates ?? []).length
              // Then, what Mapbox considers the best match
              || (b.relevance ?? 1.0) - (a.relevance ?? 1.0)
              // Finally, alphabetically by matching item
              || a.primary.localeCompare(b.primary))
            )
          )
        })
      }
    }
  })

  // Set up geocoder
  const [geocoder] = useState(geocodingClient())

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
                  style={{...itemStyle, 
                    ...(highlightedIndex === index
                      ? { backgroundColor: '#f2f2f2' }
                      : {})}
                  }
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <div className="primary" style={primaryStyle}>{item.primary}</div>
                  <div className="secondary" style={secondaryStyle}>{item.secondary ?? "SA2 Region"}</div>
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
