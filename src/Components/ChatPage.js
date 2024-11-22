import React, { useEffect, useState } from 'react';
import { Row, Col, Label, Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function ChatPage({ query }) {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    if (query && query.length > 0) {
      setPrompts([...prompts, ...query]);
    }
  }, [query]);

  useEffect(() => {
    axios.get('http://localhost:3001')
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
      alert(eror.message)
    });
  }, []);

  useEffect(() => {
    console.log(prompts);
    
  }, [prompts]);
  const renderChat = () => {
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
          prompt.user === "user" ? "justify-content-end" : "justify-content-start"
        }`}
      >
        <Col
          xs="10"
          sm="8"
          md="6"
          lg="5"
          className={`p-3 rounded shadow-sm ${
            prompt.user === "user" ? "bg-primary text-white" : "bg-light text-dark"
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