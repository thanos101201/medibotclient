import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import axios from 'axios';

function Signup({ handleUserUpdate }) {

    const [email, setEmail] = useState("");
    const [ name, setName ] = useState("");
    const [password, setPassword] = useState("");
    const [ borderColor, setBorderColor ] = useState("black")
    
    const serverUrl = "https://demochatbotserver.vercel.app";
    // const serverUrl = "http://localhost:3001"
    const handleSignup = () => {
        axios.post(`${serverUrl}/user`, {
            email: email,
            password: password,
            name: name
        }).then((response) => {
            if(response.data.message === "User registered"){
                handleUserUpdate({
                    email: email,
                    name: name
                });
                setBorderColor("green");
            }
            else{
                setBorderColor("red");
            }
        }).catch((err) => {
            setBorderColor("red");
            console.log(err.response.message);
            
            alert(err.message);
        });
    }

    useEffect(() => {}, [borderColor]);

  return (
    <Form>
        <FormGroup>
            <Label for="signEmail">Email</Label>
            <Input
                id='signEmail'
                type='email'
                value={email}
                placeholder='Enter your registered email id.'
                onChange={(e) => setEmail(e.target.value)}
                style={{borderColor: borderColor}}
            />
        </FormGroup>
        <FormGroup>
            <Label for="signName">Name</Label>
            <Input
                id='signName'
                type='text'
                value={name}
                placeholder='Enter your name'
                onChange={(e) => setName(e.target.value)}
                style={{borderColor: borderColor}}
            />
        </FormGroup>
        <FormGroup>
            <Label for="signPassword">Password</Label>
            <Input
                id='signPassword'
                type='password'
                value={password}
                placeholder='Enter yor password'
                onChange={(e) => setPassword(e.target.value)}
                style={{borderColor: borderColor}}
            />
        </FormGroup>
        <div className='text-center'>
            <Button className='btn btn-danger' onClick={handleSignup}>Sign up</Button>
        </div>
    </Form>
  )
}

export default Signup