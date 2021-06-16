import reactDOM from 'react-dom';
import App from './App';
import  { BrowserRouter as Router } from 'react-router-dom';


reactDOM.render(
    <Router><App /></Router>,
    document.getElementById('root')
)