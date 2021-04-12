import React, { useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import { useCombobox } from "downshift"
import { usePopper } from "react-popper"
import LRU from "lru-cache"
import MapboxClient from "@mapbox/mapbox-sdk"
import MapboxGeocoder from "@mapbox/mapbox-sdk/services/geocoding"

import { sameWidthModifier } from "../utils/popper-modifiers"
import { ReactComponent as SearchIcon} from "../assets/search-icons/search.svg"
import { ReactComponent as CancelIcon} from "../assets/search-icons/cancel.svg"

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
    countries: ["AU"],
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

function SearchField({ localItems }) {
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
  const [inputElement, setInputElement] = useState(null)
  const [inputItems, setInputItems] = useState([])
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
    onIsOpenChange: ({isOpen}) => {
      // Anything that would close the suggestion menu should cause the input
      // to lose focus too.
      if (!isOpen) {
        inputElement.blur()
      }
    },
    // onSelectedItemChange: ({ selectedItem }) => {
    //   // find feature id of geocoded result
    //   // fire off feature id to map for it to do with as it will
    // }
  })

  // Set up geocoder
  const [geocoder] = useState(geocodingClient())
  const [geocodedItems, setGeocodedItems] = useState([])
  // Cache geocoding results for the last 1000 queries to save on API requests.
  // https://docs.mapbox.com/api/search/geocoding/#geocoding-restrictions-and-limits
  // https://www.mapbox.com/pricing/#search
  // TODO: Figure out the memory impact of having this be a big number.
  //       lru-cache can be configured to limit its actual memory size, though
  //       you have to teach it how to calculate the size.
  const [geocoderItemsCache] = useState(new LRU(1000))

  useEffect(() => {
    // TODO: Add a bit of hysteresis to uncached geocoding requests, e.g. wait
    //       300ms before firing off forwardGeocode() and cancell any pending
    //       calls currently waiting to go. Should be simple enough to do with
    //       something like https://github.com/xnimorz/use-debounce.

    // Normalize query to lowercase and compress whitespace
    // e.g. " Ban  ana   " -> "Ban ana"
    const query = inputValue.toLowerCase().replace(/\s+/g, ' ').replace(/(^\s+|\s+$)/g, '')
    // Don't waste the Geocoding API quota on very short queries
    if (query.length < 3) {
      setGeocodedItems([])
    } else {
      let cachedItems = geocoderItemsCache.get(query)
      if (cachedItems) {
        setGeocodedItems(cachedItems)
      } else {
        forwardGeocode(geocoder, query, (features) => {
          geocoderItemsCache.set(query, features)
          setGeocodedItems(features)
        })
      }
    }
  }, [inputValue, geocoder, geocoderItemsCache])

  useEffect(() => {
    const query = inputValue.toLowerCase().replace(/\s+/g, ' ').replace(/(^\s+|\s+$)/g, '')
    if (query === '') {
      setInputItems(localItems.sort((a, b) => {a.primary.localeCompare(b.primary)}))
    } else {
      setInputItems([
          // Case-insensitive substring match
        ...localItems
          .filter(item => item.primary.toLowerCase().indexOf(query.toLowerCase()) !== -1)
          .sort((a, b) => {a.primary.localeCompare(b.primary)}),
        ...geocodedItems.sort((a, b) => {
          (b.relevance ?? 1.0) - (a.relevance ?? 1.0) ||
          a.primary.localeCompare(b.primary)
        })
      ])
    }
  }, [localItems, geocodedItems, inputValue])

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
          placeholder: "Search by suburb or region",
          spellCheck: "disable",
          ref: setInputElement,
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

SearchField.propTypes = {
  // TODO: Use arrayOf()
  localItems: PropTypes.array
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
