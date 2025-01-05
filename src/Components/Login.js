import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import axios from 'axios';
function Login({ handleUserUpdate }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ borderColor, setBorderColor ] = useState("black")

    // const serverUrl = "http://localhost:3001"
  const serverUrl = "https://demochatbotserver.vercel.app";
    const handleLogin = () => {
        axios.post(`${serverUrl}/user/login`, {
            email: email,
            password: password
        }).then((response) => {
            if(response.data.message === "User can proceed"){
                handleUserUpdate({
                    email: email,
                    name: response.data.name
                });
                setBorderColor("green");
            }
            else{
                setBorderColor("red");
            }
        }).catch((err) => {
            setBorderColor("red");
            console.log(err);
            
            alert(err.response.data.message);
        });
    }
  return (
    <Form>
        <FormGroup className='mb-3'>
            <Label for="loginEmail">Email</Label>
            <Input
                id='loginEmail'
                type='email'
                placeholder='Enter your registered email id'
                style={{borderColor:borderColor}}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </FormGroup>
        <FormGroup className='mb-3'>
            <Label for="loginPassword">Password</Label>
            <Input
                id='loginPassword'
                type='password'
                placeholder='Enter your password'
                style={{borderColor:borderColor}}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </FormGroup>
        <div className="text-center">
            <Button className='btn btn-success' onClick={handleLogin}>Login</Button>
        </div>
    </Form>
  )
}

export default Login