import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import MapChart from './Components/MapChart';
import axios from 'axios';
import CSVReader from './Components/CSVReader';
import CSVPath from './assets/qna_pairs_generated_large.csv';
import ChatPage from './Components/ChatPage';
import QueryBox from './Components/QueryBox';
import { Container, Row, Col } from 'reactstrap';
function App() {
  const [userPrompt, setUserPrompt] = useState([]);
  const [questionaire, setQuestionaire] = useState([]);
  const [countyName, setCountyName] = useState("");

  const countyNames = [
    "Abbeville",
    "Aiken",
    "Allendale",
    "Anderson",
    "Bamberg",
    "Barnwell",
    "Beaufort",
    "Berkeley",
    "Calhoun",
    "Charleston",
    "Cherokee",
    "Chester",
    "Chesterfield",
    "Clarendon",
    "Colleton",
    "Darlington",
    "Dillon",
    "Dorchester",
    "Edgefield",
    "Fairfield",
    "Florence",
    "Georgetown",
    "Greenville",
    "Greenwood",
    "Hampton",
    "Horry",
    "Jasper",
    "Kershaw",
    "Lancester",
    "Laurens",
    "Lee",
    "Lexington",
    "Marion",
    "Marlborom",
    "McCormick",
    "Newberry",
    "Oconee",
    "Orangeburg",
    "Pickens",
    "Richland",
    "Saluda",
    "Spartanburg",
    "Sumter",
    "Union",
    "Williamsburg",
    "York"
  ]
  const handleClick = (prompt) => {
    
    if(questionaire !== undefined && questionaire.length > 0){
      // console.log(prompt);
      var questionIndex = questionaire.filter(question => question[0] === prompt);
      // console.log(questionIndex);
      const countyNams = getCountyNameFromPrompt(prompt);
      console.log(countyNams);
      
      if(countyNams.length > 0){
        const name = countyNams[0].replace(/[^a-zA-Z0-9 ]/g, "");
        console.log(name);
        setCountyName(name);
      }
      if(questionIndex === null || questionIndex.length === 0){
        var arr = [
          {
            user: "user",
            text: prompt
          },
          {
            user: "chat",
            text: "I am not having information regarding asked query"
          }
        ]
        axios.post('https://demochatbotserver.vercel.app/', {
          user: "user",
          query: prompt
        }).then((response) => {
          if(response.data.message === "Chat added"){
            axios.post('https://demochatbotserver.vercel.app/', {
              user: "chat",
              query: "I am not having information regarding asked query"
            }).then((response1) => {
              console.log(response.data.message);
            }).catch((eror1) => {
              alert(eror1.message);
            })
          }
        }).catch((eror) => {
          alert(eror.message);
        })
        setUserPrompt(arr);
      }
      else{
        var arr = [
          {
            user: "user",
            text: prompt
          },
          {
            user: "chat",
            text: questionIndex[0][1]
          }
        ]
        axios.post('https://demochatbotserver.vercel.app/', {
          user: "user",
          query: prompt
        }).then((response) => {
          if(response.data.message === "Chat added"){
            axios.post('https://demochatbotserver.vercel.app/', {
              user: "chat",
              query: questionIndex[0][1]
            }).then((response1) => {
              console.log(response.data.message);
            }).catch((eror1) => {
              // alert(eror1.message);
            })
          }
        }).catch((eror) => {
          // alert(eror.message);
        })
        setUserPrompt(arr);
      }
    }
  }

  const getCountyNameFromPrompt = (prompt) => {
    var tokens = prompt.split(" ");
    console.log(tokens[0]);
    var elements = [];
    for(var element in tokens){
      var name = tokens[element].replace(/[^a-zA-Z0-9 ]/g, "");
      console.log(`${tokens[element]} : ${name}`);
      
      if(countyNames.indexOf(name) !== -1){
        elements.push(name);
      }
    }

    console.log(elements);
    
    return elements;
  }
  useEffect(() => {}, [countyName]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await CSVReader(CSVPath);
      // console.log(data);
      setQuestionaire(data.data);
    };
    fetchData();
  }, []);
  return (
    <Container fluid className="vh-100 d-flex flex-column">
      <Row className="flex-grow-1">
        {/* Map Section */}
        <Col
          md={8}
          className="d-flex justify-content-center align-items-center bg-light border-end"
        >
          <MapChart countyName={countyName} />
        </Col>

        {/* Chat Section */}
        <Col md={4} className="d-flex flex-column">
          {/* Chat Content */}
          <div className="flex-grow-1 overflow-auto p-3">
            <ChatPage query={userPrompt} />
          </div>
          {/* Query Box */}
          <div className="border-top p-3 bg-light">
            <QueryBox setUserPrompt={handleClick} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
