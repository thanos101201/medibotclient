import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import geojson from "../assets/South_carolina_County.geojson"; //"./assets/South_carolina_County.geojson";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
function MapChart({countyName}) {
  return (
    <div className='container'>
        <div className='row d-flex justify-content-center'>
            <div className='col-12 d-flex align-items-center'>
            <ComposableMap
                projectionConfig={{ scale: 250 }}
                    style={{
                    width: "100%",
                    height: "100%",
                    }}>
                <ZoomableGroup zoom={10} center={[-78,35]}>
                    <Geographies geography={geojson}>
                    {(geographies) => {
                        if(geographies !== undefined){
                        console.log(geographies);
                        
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
            </div>
        </div>
    </div>
  )
}

export default MapChart