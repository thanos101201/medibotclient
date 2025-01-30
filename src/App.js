import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import MapChart from './Components/MapChart';
import axios from 'axios';
import CSVReader from './Components/CSVReader';
import CSVPath from './assets/qna_pairs_generated_large_version3.csv';
import ChatPage from './Components/ChatPage';
import QueryBox from './Components/QueryBox';
import { Container, Row, Col, Nav, NavbarBrand, Navbar, Button, Modal, TabContent, TabPane, ModalBody, NavLink, ModalHeader, Badge } from 'reactstrap';
import Signup from './Components/Signup';
import Login from './Components/Login';
function App() {
  /// State variable to store the prompt provided by the user.
  const [userPrompt, setUserPrompt] = useState([]);
  /// State variable to store the questionaire read from the csv file.
  const [questionaire, setQuestionaire] = useState([]);
  /// State variable to store the name of the county present in user prompt.
  const [countyName, setCountyName] = useState("");
  /// State variable to store the user credential (email)
  const [user, setUser] = useState({name: "User"})
  /// State variable to store the open state of the modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  /// State varialble to store the currently active tab.
  const [ activeTab, setActiveTab ] = useState("1");
  /// State variable to show and hide chat interface.
  const [ showChat, setShowChat ] = useState(false);
  /// Name of the counties present in the csv.
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
  /// Stores the url of the backend-server to which requests are made by the application
  /// for fetching data.
  const serverUrl = "https://demochatbotserver.vercel.app";
  // const serverUrl = "http://localhost:3001"

  /// Function for extracting response for the provided query.
  /// handleClick is passed as a prop to the QueryBox component.
  const handleClick = (prompt) => {
    if(questionaire !== undefined && questionaire.length > 0){
      /// Filtering the appropriate response for the provided query.
      var questionIndex = questionaire.filter(question => question[0] === prompt);
      /// Extracting the county name present in the query.
      const countyNams = getCountyNameFromPrompt(prompt);
      console.log(countyNams);
      /// Adding chat object to the database with no response
      /// If no appropriate response is obtained for the provided
      /// query.
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
        if(countyNams.length > 0){
          const name = countyNams[0].replace(/[^a-zA-Z0-9 ]/g, "");
          console.log(name);
          setCountyName(null);
        }
        else{
          setCountyName(null);
        }
        console.log(user.email);
        /// Making a post request to the server for storing the chat object to the database
        /// for future reference.
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
        /// Creating chat object with the appropriate response obtained
        /// from the csv.
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
        if(countyNams.length > 0){
          const name = countyNams[0].replace(/[^a-zA-Z0-9 ]/g, "");
          console.log(name);
          /// countyName name can be set, so that the MapChart component can zoom
          /// on to the corresponding county map.
          setCountyName(name);
        }
        else{
          setCountyName(null);
        }
        console.log(user.email);
        /// Making post request to the server for storing chat object
        /// in the database.
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

  /// Extracts the name of county present in the porvided prompt.
  const getCountyNameFromPrompt = (prompt) => {
    /// Splitting the prompt based on the space between elements.
    var tokens = prompt.split(" ");
    console.log(tokens[0]);
    var elements = [];
    /// Looping over the tokens and checking if any token
    /// is present in the county names list.
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
  /// Updating the user creds when the 
  /// user successfully makes login or signin.
  const handleUserUpdate = (name) => {
    setUser(name);
  }
  /// Reseting the value of isModalOpen state variable
  /// as soon as the page rerenders.
  useEffect(() => {
    setIsModalOpen(!isModalOpen);
  }, [user]);
  /// Forcing a rerender of the component as soon as
  /// the value of countyName is updated.
  useEffect(() => {},[countyName]);
  /// Reading the csv file containing the questionaire
  /// when the component renders for the first time.
  useEffect(() => {
    const fetchData = async () => {
      const data = await CSVReader(CSVPath);
      setQuestionaire(data.data);
    };
    fetchData();
  }, []);
  /// toggle resets the value of isModelOpen
  const toggle = () => setIsModalOpen(!isModalOpen);

  /// getUserBadgeTitle returns an appropriate value
  /// of the title displayed in the badge based on the
  /// value of user state variable.
  const getUserBadgeTitle = (name) => {
    if(name === 'User'){
      return name;
    }
    console.log(name);
    
    var tokens = name.split(' ');
    console.log(tokens);
    
    var title = "";
    for(var i=0;i<tokens.length;i++){
      title = title + tokens[i][0];
      console.log(`${title} : ${tokens[i]}`);
      
    }
    title = title.trim();
    title = title.toUpperCase();
    return title;
  }

  return (
    <Container fluid className="vh-100 d-flex flex-column">
      {/* Modal for Login and Signup */}
      <Modal isOpen={isModalOpen} toggle={toggle}>
        <ModalHeader>
          <Nav pills>
            <NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>Login</NavLink>
            <NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>Sign up</NavLink>
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
      <Navbar style={{position: 'fixed', width:'100%', paddingBottom:'20px', zIndex:1}}>
        <NavbarBrand>
          <Button
            style={{
              backgroundColor: 'white',
              border: '0px',
              borderColor: 'white',
              width:'100%'
            }}
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <Badge className='shadow-lg' style={{borderRadius:'56px'}} color='primary'>
              {/* <h6>{user.name}</h6> */}
              <h6>{getUserBadgeTitle(user.name)}</h6>
            </Badge>
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
