import React from 'react'
import Papa from "papaparse";
/// Reads the content of the csv file,
/// whose path is provided as parameter.
function CSVReader(csvPath) {
    
    if(csvPath === null || typeof(csvPath) !== "string" || csvPath.length === 0){
        return null;
    }
    /// Reads the data from the csv file.
    return fetch(csvPath)
    .then(response => response.text())
    .then(responseText => {
        /// Parsing the read data to an object.
        var data = Papa.parse(responseText);
        return data;
    })

}

export default CSVReader