import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jsonPath from "../assets/South_carolina_County.geojson";
import mchCsvPath from '../assets/South_Carolina_Healthviz_Version3_csv.csv';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import CSVReader from "./CSVReader";
import { Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";

function MapChart({ countyName }) {
  const [geoJson, setGeoJson] = useState(null);
  const [zoomVal, setZoomVal] = useState(20);
  const [mchData, setMchData] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCounty, setHoveredCounty] = useState("");

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

  const center = useMemo(() => {
    const defaultCenter = [-80, 33];
    if (!countyName || !geoJson?.features) return defaultCenter;

    const targetFeature = geoJson.features.find(
      (feature) =>
        feature.properties.county_nam &&
        feature.properties.county_nam.trim().toLowerCase() === countyName.trim().toLowerCase()
    );

    if (targetFeature) {
      const centroid = geoCentroid(targetFeature);
      setZoomVal(50);
      return centroid;
    }

    console.warn(`County not found: ${countyName}`);
    return defaultCenter;
  }, [countyName, geoJson]);

  const getCountyData = () => {
    if (!selectedCounty || mchData.length === 0) return [];
    return mchData.filter((mch) => mch[0] === selectedCounty);
  };

  const randomColorGenerator = () => {
    const colors = ["#D4EBF8", "#80C4E9", "#B3C8CF", "#78B3CE", "#C6E7FF"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const toggle = () => setIsModalOpen(!isModalOpen);

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
                      geographies.map((geo) => (
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
                      ))
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
