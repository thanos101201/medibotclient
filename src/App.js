import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import MapChart from './Components/MapChart';
import axios from 'axios';
import CSVReader from './Components/CSVReader';
import CSVPath from './assets/qna_pairs_generated_large_version3.csv';
import ChatPage from './Components/ChatPage';
import QueryBox from './Components/QueryBox';
import { Container, Row, Col, Nav, NavbarBrand, Navbar, Button, Modal, TabContent, TabPane, ModalBody, NavLink, ModalHeader } from 'reactstrap';
import Signup from './Components/Signup';
import Login from './Components/Login';
function App() {
  const [userPrompt, setUserPrompt] = useState([]);
  const [questionaire, setQuestionaire] = useState([]);
  const [countyName, setCountyName] = useState("");
  const [user, setUser] = useState({name: "User"})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ activeTab, setActiveTab ] = useState("1");
  const [ showChat, setShowChat ] = useState(false);

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
  const serverUrl = "https://demochatbotserver.vercel.app";
  // const serverUrl = "http://localhost:3001"
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
            userTag: "user",
            text: prompt
          },
          {
            userTag: "chat",
            text: "I am not having information regarding asked query"
          }
        ]
        console.log(user.email);
        
        if(user.email !== undefined && user.email !== null && user.email.length !== 0){
          axios.post(`${serverUrl}/chat`, {
            userTag: "user",
            email: user.email,
            query: prompt
          }).then((response) => {
            if(response.data.message === "Chat added"){
              axios.post(`${serverUrl}/chat`, {
                userTag: "chat",
                email: user.email,
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
        }
        setUserPrompt(arr);
      }
      else{
        var arr = [
          {
            userTag: "user",
            text: prompt
          },
          {
            userTag: "chat",
            text: questionIndex[0][1]
          }
        ]
        console.log(user.email);
        
        if(user.email !== undefined && user.email !== null && user.email.length !== 0){
          axios.post(`${serverUrl}/chat`, {
            userTag: "user",
            query: prompt,
            email: user.email
          }).then((response) => {
            if(response.data.message === "Chat added"){
              axios.post(`${serverUrl}/chat`, {
                userTag: "chat",
                email : user.email,
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
        }
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
  const handleUserUpdate = (name) => {
    setUser(name);
  }
  useEffect(() => {}, [countyName, user]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await CSVReader(CSVPath);
      setQuestionaire(data.data);
    };
    fetchData();
  }, []);
  const toggle = () => setIsModalOpen(!isModalOpen);
  return (
    <Container fluid className="vh-100 d-flex flex-column">
      {/* Modal for Login and Signup */}
      <Modal isOpen={isModalOpen} toggle={toggle}>
        <ModalHeader>
          <Nav tabs>
            <NavLink onClick={() => setActiveTab('1')}>Login</NavLink>
            <NavLink onClick={() => setActiveTab('2')}>Sign up</NavLink>
          </Nav>
        </ModalHeader>
        <ModalBody>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Login handleUserUpdate={handleUserUpdate} />
            </TabPane>
            <TabPane tabId="2">
              <Signup handleUserUpdate={handleUserUpdate} />
            </TabPane>
          </TabContent>
        </ModalBody>
      </Modal>

      {/* Navbar */}
      <Navbar>
        <NavbarBrand>
          <Button
            style={{
              backgroundColor: 'white',
              border: '0px',
              borderColor: 'white',
            }}
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <h6 style={{ color: 'black' }}>{user.name}</h6>
          </Button>
        </NavbarBrand>
      </Navbar>

      {/* Main Content */}
      <Row className="flex-grow-1">
        {/* Map Section */}
        <Col
          className="d-flex justify-content-center align-items-center bg-light"
          style={{ width: '100%' }}
        >
          <MapChart countyName={countyName} />
        </Col>

        {/* Chat Section - Conditionally Rendered */}
        {showChat && (
          <Col md={4} className="d-flex flex-column">
            <div className="flex-grow-1 overflow-auto p-3">
              <ChatPage query={userPrompt} email={user.email} />
            </div>
            <div className="border-top p-3 bg-light">
              <QueryBox setUserPrompt={handleClick} />
            </div>
          </Col>
        )}
      </Row>

      {/* Button to Toggle Chat Section */}
      <Button
        onClick={() => setShowChat(!showChat)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          backgroundColor: '#007bff',
          color: '#fff',
          fontSize: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
          border: 'none',
        }}
      >
        {showChat ? '✕' : '💬'}
      </Button>
    </Container>
  );
}

export default App;
