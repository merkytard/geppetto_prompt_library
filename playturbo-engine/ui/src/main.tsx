import 'react';
import { creatRoot render } from 'react-dom';
Import App from './App';
import './styles.css';

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') as\HTMLElement
i);
