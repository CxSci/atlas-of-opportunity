# Detail Layout Description

The layout of the Atlas's detail page is dynamic, not hardcoded. There will be a API endpoint the frontend should fetch on site load which described how each dataset should be displayed to users.

The response is an array of `sections`, each section having a `title` string and an array of `metrics` objects. Details about the contents of a metric object follow below.

For an example of what a whole layout response looks like, see detail_layout_example_small_business_support.json.

## title

The metric's title. If undefined, there is no title.

## key

The key to use in the data object to find the metric's values.

## type

Each metric has a `type`, indicating its general appearance. If type is undefined, treat it as `"text"`.

Note that some metrics vary their appearance when multiple axes are defined.

### Simple Types

Simple types may represent a single value or a collection of values. If `x` and `y` are not present, they show a single value. If `x` and `y` are present, `x` is the subheading for each value and `y` is the value to be displayed.

- `"text"`
  Simple text. Default.

- `"simple_bar"`
  Horizontal bar chart with appended text values.

- `"simple_range"`
  Horizontal bar chart without any text values.

### Complex Types

Complex types represent collections of values and require the presence of `x`, `y`, and sometimes `z` axes.

- `"line"`
  Line chart.

- `"stacked_area"`
  Stacked area chart.

## format

- default or `"plain"`
  Present the value as is. If `format` is undefined, treat it as `"plain"`.

- `"number"`
  Treat the value as a number and localize it with `Intl.NumberFormat`. If `numberFormat` is undefined, create a `Intl.NumberFormat` without an options parameter.

## numberFormat

If `format === "number"`, these are the options to pass to `Intl.NumberFormat` when localizing this value.

For example, the following metric object says Median Income represents currency in Australian dollars. For the value `123.45`, a user in the United States (`en-US`) would see `"A$123.45"` while a user in Australia (`en-AU`) would see `"$123.45"`.

```json
{
  "title": "Median Income",
  "key": "median_income_aud",
  "type": "text",
  "format": "number",
  "numberFormat": {
    "style": "currency",
    "currency": "AUD"
  }
}
```

For another example, the following object says the value of each bracket in Resident Age is a percentage which should include up to 2 fractional digits. Given the value `0.421234`, a user in the United States (`en-US`) would see `"42.12%"` while a user in Germany (`de-DE`) would see `"42,12 %"`.

```json
{
  "title": "Resident Age",
  "key": "percentage_persons_aged",
  "type": "text",
  "x": {
    "key": "bracket"
  },
  "y": {
    "key": "percent",
    "format": "number",
    "options": {
      "style": "percent",
      "maximumFractionDigits": 2
    }
  }
}
```

## options

Optional configuration for different metric types. Possible keys and values vary by `type`.

- `min` and `max`
  The minimum and maximum limits for metrics where that matters. `"simple_bar"` and `"simple_range"` default `min` to 0 and `max` to 1. Other metric types default to calculating their own ranges based on available data.

- `style`
  For metric types with multiple styles. For example, `type === "simple_range"` has `"solid"` and `"gradient"` styles, and `type === "text"` has `"default"` and `"square"` styles.

## x, y, and z

Axes for multi-dimensional metrics. Each details how to find and format their data. Axes can contain their own `key`, `format`, `numberFormat`, `options`,

## filters

Filters for limiting a metric to a subset of its data. Defined as either hardcoded whitelists of keys and value or as controls which a user can interact with.

- `key`
  The key to filter by.

- `values`
  A whitelist of allowed values. If a value isn't in the list, it shouldn't be rendered for the user.

- `control`
  For interactive filters. Only option currently is `"select"`, which shows a dropdown menu for selecting a single value to filter on.

- `title`
  The string to put in the label for filters with controls.

- `default_value`
  For interactive filters. The default selection, if it exists within the data.

For example, these two metrics have the same `key` but each show only one `type`.

```json
{
  "title": "Apartments: Median Weekly Rent",
  "key": "residential_housing_median",
  "type": "text",
  "x": {
    "key": "rooms"
  },
  "y": {
    "key": "rent",
    "format": "number",
    "options": {
      "style": "currency",
      "currency": "AUD"
    }
  },
  "filters": [
    {
      "key": "type",
      "values": ["Apartments"]
    }
  ]
},
{
  "title": "Houses: Median Weekly Rent",
  "key": "residential_housing_median",
  "type": "text",
  "x": {
    "key": "rooms"
  },
  "y": {
    "key": "rent",
    "format": "number",
    "options": {
      "style": "currency",
      "currency": "AUD"
    }
  },
  "filters": [
    {
      "key": "type",
      "values": ["Houses"]
    }
  ]
}
```

For another example, this metric has a dropdown menu allowing users to filter by year. It starts with year 2019 selected, if that exists in the data.

```json
{
  "key": "business_counts",
  "type": "text",
  "x": {
    "key": "anzsic",
    "options": {
      "style": "square"
    }
  },
  "y": {
    "key": "value",
    "format": "number"
  },
  "filters": [
    {
      "key": "year",
      "control": "select",
      "title": "Year",
      "default_value": "2019"
    }
  ]
}
```
