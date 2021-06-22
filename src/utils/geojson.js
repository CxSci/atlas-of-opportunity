let newFeatureColl = [];
const arcSec = 1 / ( 60 * 60 * 10 );

export const rebuildFeatures = (features) => {
  const result = features.map(feature => {
    const geometry = feature.geometry;
    if (geometry) {
      const coordinateCollection = geometry.coordinates;
      const newCoordColl = coordinateCollection.map(coordArr => {
        if (Array.isArray(coordArr[0]) && coordArr[0].length !== 2) {
          const newChild = coordArr.map(child => generateAbsoluteCoord(child));
          return newChild;
        }
        const newCoord = generateAbsoluteCoord(coordArr);
        return newCoord;
      })
      geometry.coordinates = newCoordColl;
    }
    return feature;
  })
  return result;
}

export const convertFeatures = (featureCollection) => {
  const features = featureCollection.filter(ft => 
    true
    // && ft.geometry?.type === 'MultiPolygon'
    // && ft.properties.AREASQKM16 > 500
    // ft.geometry?.coordinates.length === 1 &&
    // ft.geometry.coordinates.every(coord => coord.length < 99)
  );
  // return features;
  const result = features.map(feature => {
    const geometry = feature.geometry;
    if (geometry) {
      const coordinateCollection = geometry.coordinates;
      const newCoordColl = coordinateCollection.map(coordArr => {
        if (Array.isArray(coordArr[0]) && coordArr[0].length !== 2) {
          const newChild = coordArr.map(child => convertToDeltas(child));
          return newChild;
        }
        const newCoord = convertToDeltas(coordArr);
        const pad = (val) => `${val}`.padEnd(18);
        const long = coordArr.slice(0, 10).map((_,i) => 
          `prev: [${pad(coordArr[i][0])}, ${pad(coordArr[i][1])}] \n|` + 
          `post: [${pad(newCoord[i][0])}, ${pad(newCoord[i][1])}] `
        );
        const text = long.join('\n|');
        return newCoord;
      })
      const geo = {...feature.geometry};
      geo.coordinates = newCoordColl;
      const fea = {...feature, geometry: geo};
      newFeatureColl.push(fea);
      // feature.geometry.coordinates = newCoordColl;
    }
    return feature;
  })
  const json = stringify(newFeatureColl);
  // adaptFeaturesBinary(features);
  saveAs(json);
  const list = result;//.slice(0, 10);
  return list;
}

const adaptFeaturesBinary = async (features) => {
  const newFeatures = features.map(async feature => {
    const feat = {...feature};
    const geo = {...feat.geometry};
    if (geo.coordinates) {
      const coordinateCollection = geo.coordinates;
      const dataArray = coordinateCollection.map(async coord => {
        const result = await convertToBinary(coord);
        return result;
      })
      geo.coordinates = await Promise.all(dataArray);
    }
    return feature;
  })
  const result = await Promise.all(newFeatures);
  const json = stringify(result);
  // saveAs(json);
}

async function convertToBinary(coords) {
  const array = new Array(coords).flat(4);
  const floats = new Float32Array(array);
  const blob = new Blob([floats.buffer], {type:'application/octet-binary'});
  
  return new Promise(resolve => {
    var fileReader = new FileReader();
    fileReader.onload = function() {
      var dataUri = fileReader.result;
      var base64 = dataUri.substr(dataUri.indexOf(','));
      resolve(base64);
    };
    fileReader.readAsDataURL(blob);
  });
}

function convertToDeltas(coordArray) {
  coordArray = coordArray.map(pair => pair.map(round));
  const newItem = coordArray.map((pair, idx) => {
    if (idx === 0) return pair.map(nearest);
    const origin = coordArray[idx-1].map(nearest);
    const lon = Math.round((pair[0] - origin[0]) / arcSec);
    const lat = Math.round((pair[1] - origin[1]) / arcSec);
    return [lon, lat];
  });
  // newItem.shift();
  // newItem.unshift(origin);
  const srcItem = generateAbsoluteCoord(newItem, arcSec);
  return newItem;
  // console.log(newItem.map(x => x.join(',')));
}

function generateAbsoluteCoord(itemColl) {
  const items = [...itemColl];
  items.forEach((pair, idx, arr) => {
    if (idx === 0) return pair;
    const origin = arr[idx-1];
    const lon = pair[0] * arcSec + origin[0];
    const lat = pair[1] * arcSec + origin[1];
    arr[idx] = [lon, lat].map(round);
  })
  return items;
}

function round(value) {
  const decimals = 10**9;
  const result = Math.round(value * decimals) / decimals;
  return result;
}

function nearest(value) {
  const int = Math.trunc(value);
  const result = Math.round((value - int) / arcSec) * arcSec + int;
  return round(result);
}

function stringify(array) {
  const strfyItem = (item) => {
    let text = JSON.stringify(item).replace(/("geometry":)/, '$1\n');
    text = text.replace(/(.{2060}.{1,15}\],)/g, '$1\n');
    return text;
    // const pos = text.indexOf('\n') + 2080;
    // text.splice
  }
  const strings = array.map(strfyItem);
  return strings.join(',\n');
}

function saveAs(text) {
  var a = document.createElement('a')
  var now = new Date();
  a.download = `file-${now.toLocaleTimeString().substr(0,5).replace(':','\'')}`;
  //.dispatchEvent(new MouseEvent('click'))
  var blob = new Blob([text], {
    type: "application/json;charset=utf-8"
  });
  a.href = URL.createObjectURL(blob)
  a.click();
}
