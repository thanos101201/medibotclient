import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jsonPath from "../assets/South_carolina_County.geojson";
import mchCsvPath from '../assets/South_Carolina_Healthviz_Version3_csv.csv';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import CSVReader from "./CSVReader";
import { Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner, Button } from "reactstrap";

function MapChart({ countyName }) {
  /// State variable to store geoJson data which is used for viewing the map.
  const [geoJson, setGeoJson] = useState(null);
  /// State variable to store the value of zoom level on the map.
  const [zoomVal, setZoomVal] = useState(29);
  /// State variable to store the selected county data.
  const [mchData, setMchData] = useState([]);
  /// State variable to store the selected county name.
  const [selectedCounty, setSelectedCounty] = useState("");
  /// State variable to store the open state of the modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  /// State variable to store the name of hovered county.
  const [hoveredCounty, setHoveredCounty] = useState("");
  /// State variable to store the flag which specifies whether the screen is small sized or not.
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  /// Fetches the county data as soon as the component renders for the first time.
  useEffect(() => {
    fetch(jsonPath)
      .then((response) => response.json())
      .then((data) => setGeoJson(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));

    const fetchData = async () => {
      const data = await CSVReader(mchCsvPath);
      setMchData(data.data);
    };
    fetchData();
  }, []);

  /// Sets the focus center of the map.
  const center = useMemo(() => {
    const defaultCenter = [-80, 33];
    if (!countyName || !geoJson?.features){
      setZoomVal(29);
      return defaultCenter;
    } 

    const targetFeature = geoJson.features.find(
      (feature) =>
        feature.properties.county_nam &&
        feature.properties.county_nam.trim().toLowerCase() === countyName.trim().toLowerCase()
    );

    if (targetFeature) {
      const centroid = geoCentroid(targetFeature);
      setZoomVal(29);
      return centroid;
    }

    console.warn(`County not found: ${countyName}`);
    return defaultCenter;
  }, [countyName, geoJson]);

  /// Sets the data of the selected county to the state variable.
  const getCountyData = () => {
    if (!selectedCounty || mchData.length === 0) return [];
    return mchData.filter((mch) => mch[0] === selectedCounty);
  };

  useEffect(() => {
    console.log(`County name is ${countyName}`);
  })

  /// Generates color randomly for the counties.
  const randomColorGenerator = () => {
    const colors = ["#D4EBF8", "#80C4E9", "#B3C8CF", "#78B3CE", "#C6E7FF"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  /// Makes the map interface to zoom in.
  const handleZoomIn = () => {
    var zoom = zoomVal;
    zoom = zoom + 1;
    console.log(zoom);
    
    setZoomVal(zoom);
  }

  /// Makes the map interface to zoom out.
  const handleZoomOut = () => {
    var zoom = zoomVal
    zoom = zoom - 1;
    console.log(zoom);
    setZoomVal(zoom);
    
  }

  useEffect(() => {
    console.log(`Zoom value is ${zoomVal}`);
  }, [zoomVal]);

  /// Toggles the modal which shows the detail of the selected county.
  const toggle = () => setIsModalOpen(!isModalOpen);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /// Stores the style of the zoom in and zoom out buttons.
  const buttonStyles = {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: isSmallScreen ? "6px 8px" : "10px 12px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    fontWeight: "bold",
    fontSize: isSmallScreen ? "0.75rem" : "1rem",
  };


  /// Renders the rows of the modal which shows counties details.
  /// Each row contain two columns, one for property name and the 
  /// other one for property value.
  const renderModalRows = () => {
    const countyData = getCountyData();
    const headers = mchData[0];

    if (!countyData.length || !headers.length) return <div>No data available.</div>;

    return countyData[0].map((data, index) => (
      <Row key={index} style={{ borderBottom: "1px solid #eee", paddingBottom: "8px", marginBottom: "8px" }}>
        <Col xs={6} style={{ textAlign: "right", paddingRight: "12px", fontWeight: "bold" }}>
          <Label>{headers[index]}</Label>
        </Col>
        <Col xs={6} style={{ textAlign: "left", paddingLeft: "12px" }}>
          <Label>{data}</Label>
        </Col>
      </Row>
    ));
  };

  /// Renders the MapChart component.
  return (
    <div className="container" style={{ padding: "20px" }}>
      <Modal isOpen={isModalOpen} toggle={toggle}>
        <ModalHeader toggle={toggle} style={{ backgroundColor: "#007bff", color: "#fff", fontWeight: "bold" }}>
          Data for {selectedCounty}
        </ModalHeader>
        <ModalBody style={{ maxHeight: "400px", overflowY: "auto" }}>
          {renderModalRows()}
        </ModalBody>
      </Modal>

      <div className="row justify-content-center">
        <div
          className="col-12"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            border: "2px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {geoJson ? (
            <>
              <ComposableMap
                projectionConfig={{ scale: 250 }}
                style={{ width: "100%", height: "auto" }}
              >
                <ZoomableGroup zoom={zoomVal} center={center}>
                  <Geographies geography={geoJson}>
                    {({ geographies }) =>
                    {
                      /// Looping over the geographies obtained from the geojson using react-simple-maps
                      /// and rendering each geography.
                      return geographies.map((geo) => 
                      {
                        if(geo.properties !== null && geo.properties.county_nam === countyName)
                        {
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              style={{
                                default: {
                                  fill: "red",
                                  stroke: "#000",
                                  strokeWidth: 0.1,
                                  outline: "none"
                                },
                                hover: {
                                  fill: "#FFD700",
                                  outline: "none",
                                },
                                pressed: {
                                  fill: "#FFA500",
                                  outline: "none",
                                },
                              }}
                              onMouseEnter={() => setHoveredCounty(geo.properties.county_nam)}
                              onMouseLeave={() => setHoveredCounty("")}
                              onClick={() => {
                                setSelectedCounty(geo.properties.county_nam);
                                setIsModalOpen(true);
                              }}
                            />
                          );
                        }
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            style={{
                              default: {
                                fill: randomColorGenerator(),
                                stroke: "#000",
                                strokeWidth: 0.1,
                                outline: "none",
                              },
                              hover: {
                                fill: "#FFD700",
                                outline: "none",
                              },
                              pressed: {
                                fill: "#FFA500",
                                outline: "none",
                              },
                            }}
                            onMouseEnter={() => setHoveredCounty(geo.properties.county_nam)}
                            onMouseLeave={() => setHoveredCounty("")}
                            onClick={() => {
                              setSelectedCounty(geo.properties.county_nam);
                              setIsModalOpen(true);
                            }}
                          />
                        );
                      });
                    }
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
              {hoveredCounty && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    fontWeight: "bold",
                  }}
                >
                  {hoveredCounty}
                </div>
              )}
              <div
                  style={{
                    ...buttonStyles,
                    top: "70px",
                    right: "10px",
                  }}
                >
                  <Button onClick={() => handleZoomIn()}>+</Button>
                </div>
                <div
                  style={{
                    ...buttonStyles,
                    top: "130px",
                    right: "10px",
                  }}
                >
                  <Button onClick={() => handleZoomOut()}>-</Button>
                </div>
            </>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "400px", textAlign: "center" }}
            >
              <Spinner color="primary" />
              <p style={{ marginLeft: "10px" }}>Loading map...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapChart;
