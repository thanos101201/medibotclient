import React, { useEffect, useState } from 'react';
import { Row, Col, Label, Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
/// ChatPage renders the chat interface of the application.
function ChatPage({ query, email }) {
  /// Stores the value of prompts provided by the user.
  const [prompts, setPrompts] = useState([]);
  // const serverUrl = "http://localhost:3001";
  const serverUrl = "https://demochatbotserver.vercel.app";

  /// Adding the query prop to the prompts as soon as the value
  /// of the query is updated.
  useEffect(() => {
    if (query && query.length > 0) {
      setPrompts([...prompts, ...query]);
    }
  }, [query]);
  /// Fetches the previous chat conversations done between application
  /// and the user, as soon as the value of email prop is updated.
  useEffect(() => {
    if(email === undefined || email === null || email.length === 0){
      return;
    }
    axios.get(`${serverUrl}/chat?email=${email}`)
    .then((response) => {
      if(response.data !== undefined && response.data.message !== undefined){
        var chats = [];
        response.data.message.forEach((chat) => {
          // [...chats, chat];
          chats.push(chat);
        });
        setPrompts(chats);
      }
    })
    .catch((eror) => {
      // alert(eror.message)
    });
  }, [email]);

  /// Forcing rerender as soon as atleast one of the propmts
  /// or email change.
  useEffect(() => {
    console.log(email);
    
  }, [prompts, email]);
  const renderChat = () => {
    /// Renders chat object.
    if (prompts.length === 0) {
      return (
        <div className="d-flex align-items-center justify-content-center h-100">
          <h2 className="text-muted">No chat history</h2>
        </div>
      );
    }

    return prompts.map((prompt, index) => (
      <Row
        key={index}
        className={`my-2 ${
          prompt.userTag === "user" ? "justify-content-end" : "justify-content-start"
        }`}
      >
        <Col
          xs="10"
          sm="8"
          md="6"
          lg="5"
          className={`p-3 rounded shadow-sm ${
            prompt.userTag === "user" ? "bg-primary text-white" : "bg-light text-dark"
          }`}
        >
          <Label>{prompt.text}</Label>
        </Col>
      </Row>
      ));
  };

  return (
    <Container
      className="chat-container overflow-auto p-3"
      style={{
        maxHeight: '70vh',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        position: 'relative'
      }}
    >
      {renderChat()}
    </Container>
  );
}

export default ChatPage;