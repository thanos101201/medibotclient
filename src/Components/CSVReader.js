import React from 'react'
import Papa from "papaparse";

function CSVReader(csvPath) {
    
    if(csvPath === null || typeof(csvPath) !== "string" || csvPath.length === 0){
        return null;
    }
    
    return fetch(csvPath)
    .then(response => response.text())
    .then(responseText => {
        var data = Papa.parse(responseText);
        return data;
    })

}

export default CSVReader