import { useEffect, useState } from "react"
import LRU from "lru-cache"
import MapboxClient from "@mapbox/mapbox-sdk"
import MapboxGeocoder from "@mapbox/mapbox-sdk/services/geocoding"

const accessToken = "pk.eyJ1IjoieG16aHUiLCJhIjoiY2tibWlrZjY5MWo3YjJ1bXl4YXd1OGd3bCJ9.xEc_Vf2BkuPkdHhHz521-Q";

// Cache geocoding results for the last 1000 queries to save on API requests.
// https://docs.mapbox.com/api/search/geocoding/#geocoding-restrictions-and-limits
// https://www.mapbox.com/pricing/#search
// TODO: Figure out the memory impact of having this be a big number.
//       lru-cache can be configured to limit its actual memory size, though
//       you have to teach it how to calculate the size.
const geocoderItemsCache = new LRU(1000)

const useGeocoder = ({ inputValue, enabled, config, onNewFeatures }) => {
  // example MapboxGeocoder config:
  //
  // {
  //   countries: ["AU"],
  //   types: [
  //     "postcode", "district", "place", "locality"//, "neighborhood", "address"
  //   ],
  //   // Restrict search to South Australia
  //   bbox: [
  //     129.001337, -38.062603,
  //     141.002956, -25.996146
  //   ],
  //   limit: 5
  // }
  const [options] = useState(config)
  const [geocoder] = useState(MapboxGeocoder(
    MapboxClient({accessToken: accessToken}))
  )
  const [geocodedItems, setGeocodedItems] = useState([])

  useEffect(() => {
    // TODO: Add a bit of hysteresis to uncached geocoding requests, e.g. wait
    //       300ms before firing off forwardGeocode() and cancell any pending
    //       calls currently waiting to go. Should be simple enough to do with
    //       something like https://github.com/xnimorz/use-debounce.

    if (!enabled) {
      return
    }

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
        const geocoderConfig = {query, ...options}
        geocoder.forwardGeocode(geocoderConfig).send()
          .then(response => {
          if (response.body.features) {
            // Match localItems to search results located inside of them and
            // add their properties as context.
            let features = response.body.features
            features = onNewFeatures(features)
            geocoderItemsCache.set(query, features)
            setGeocodedItems(features)
          }
        })
      }
    }
  }, [inputValue, enabled, options, geocoder, onNewFeatures])

  return geocodedItems
}

export default useGeocoder;