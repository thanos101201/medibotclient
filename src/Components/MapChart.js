import React, { useState, useEffect, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsonPath from "../assets/South_carolina_County.geojson"; //"./assets/South_carolina_County.geojson"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';

function MapChart({ countyName }) {
  const [geoJson, setGeoJson] = useState(null);
  const [zoomVal, setZoomVal] = useState(10);

  useEffect(() => {
    fetch(jsonPath) // Adjust the path as needed
      .then((response) => response.json())
      .then((data) => {
        setGeoJson(data);
        // console.log(data);
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  const center = useMemo(() => {
    let defaultCenter = [-78, 35]; // Fallback coordinates
    // console.log(countyName === undefined);
    
    if(countyName === undefined || countyName === null){
        return defaultCenter;
    }
    if (geoJson && geoJson.features) {
        // console.log(countyName);
        
      const targetFeature = geoJson.features.find(
        (feature) =>
          feature.properties.county_nam &&
          feature.properties.county_nam.trim().toLowerCase() === countyName.trim().toLowerCase()
      );
      if (targetFeature) {
        const centroid = geoCentroid(targetFeature);
        setZoomVal(50);
        // console.log(`Centroid for ${countyName}:`, centroid); // Debugging log
        return centroid;
      }
    }
    console.warn(`County not found: ${countyName}`);
    return defaultCenter;
  }, [countyName, geoJson]);

  useEffect(() => {},[zoomVal]);
  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col-12 d-flex align-items-center">
          {geoJson ? (
            <ComposableMap
              projectionConfig={{ scale: 250 }}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <ZoomableGroup zoom={zoomVal} center={center}>
                <Geographies geography={geoJson}>
                  {/* {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill:
                              geo.properties.county_nam &&
                              geo.properties.county_nam.trim().toLowerCase() ===
                                countyName.trim().toLowerCase()
                                ? "#FF5722"
                                : "#EEE",
                            stroke: "#000000", // Black border
                            strokeWidth: 0.1, // Border width
                            outline: "none",
                          },
                        }}
                      />
                    ))
                  } */}
                  {(geographies) => {
                        if(geographies !== undefined){
                        // console.log(geographies);
                        // console.log(countyName);
                        
                        return(
                            geographies.geographies.map(geo => {
                            if(geo.properties.county_nam === countyName){
                                return(
                                <Geography key={geo.rsmKey} geography={geo} />
                                );
                            }
                            else{
                                return(
                                <Geography key={geo.rsmKey} geography={geo} style={{
                                    default:{
                                    fill:"#EEE",
                                    stroke: "#000000", // Black border
                                    strokeWidth: 0.1, // Border width
                                    outline: "none",
                                    }
                                }} />
                                );
                            }
                            })
                        );
                        }
                    }
                    }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapChart;



// import React from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import geojson from "../assets/South_carolina_County.geojson"; //"./assets/South_carolina_County.geojson";
// import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
// function MapChart({countyName}) {
//   return (
//     <div className='container'>
//         <div className='row d-flex justify-content-center'>
//             <div className='col-12 d-flex align-items-center'>
//             <ComposableMap
//                 projectionConfig={{ scale: 250 }}
//                     style={{
//                     width: "100%",
//                     height: "100%",
//                     }}>
//                 <ZoomableGroup zoom={10} center={[-78,35]}>
//                     <Geographies geography={geojson}>
                    // {(geographies) => {
                    //     if(geographies !== undefined){
                    //     console.log(geographies);
                        
                    //     return(
                    //         geographies.geographies.map(geo => {
                    //         if(geo.properties.county_nam === countyName){
                    //             return(
                    //             <Geography key={geo.rsmKey} geography={geo} />
                    //             );
                    //         }
                    //         else{
                    //             return(
                    //             <Geography key={geo.rsmKey} geography={geo} style={{
                    //                 default:{
                    //                 fill:"#EEE",
                    //                 stroke: "#000000", // Black border
                    //                 strokeWidth: 0.1, // Border width
                    //                 outline: "none",
                    //                 }
                    //             }} />
                    //             );
                    //         }
                    //         })
                    //     );
                    //     }
                    // }
                    // }
//                     </Geographies>
//                 </ZoomableGroup>
//                 </ComposableMap>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default MapChart