import React from 'react';
import MainGame from './components/MainGame';
import Header from './components/Header';
import './App.css';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import SampleBoard1 from './components/SampleBoard1';

function App() {
  return (
    <div className='App'>
    <div  className='container'>
      <div><Header /> </div>
      <div className=''><MainGame /> </div>
    </div>
    <h1 className=''>Sample Boards</h1>
    <p className='para'>Run Both at the same time!</p>
    <Container>
    <Col xs><SampleBoard1 /> </Col>
    <Col xs={{ order: 1 }}><SampleBoard1 /></Col> 
    </Container>
    </div>
  );
}

export default App;
