import { createRoot } from 'react-dom/client'
import './index.css'
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/:orderId" element={<App />} />
            <Route path="/" element={<div className={'text-white'}>Invalid URL</div>} />
            <Route path="*" element={<div className={'text-white'}>Invalid URL</div>} />
        </Routes>
    </BrowserRouter>,
)
