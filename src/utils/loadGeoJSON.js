const fs = require("fs");


export const loadGeoJSON = (path) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((res,_rej) => {
        fs.readFile(path, function(err, data) {
      
            // Check for errors
            if (err) throw err;
           
            // Converting to JSON
            res(JSON.parse(data))
              
        });
    })
}