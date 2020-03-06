import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'; 
import Home from "./Screens/Home/";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import Chat from "./Screens/Chat";

const App=()=>(
 <Router>
   <Route exact path="/" component={Home}/>
   <Route exact path="/login" component={Login}/>
   <Route exact path="/register" component={Register}/>
   <Route exact path='/chat/:name?/:id?' component={Chat}/>
   <Route/>
 </Router>
)

export default App;
