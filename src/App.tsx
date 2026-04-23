import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import UnclearedInterval from './pages/UnclearedInterval';
import UnremovedListener from './pages/UnremovedListener';
import StaleClosure from './pages/StaleClosure';
import GlobalVariable from './pages/GlobalVariable';
import DetachedDOM from './pages/DetachedDOM';
import ModalLeak from './pages/ModalLeak';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="uncleared-interval" element={<UnclearedInterval />} />
        <Route path="unremoved-listener" element={<UnremovedListener />} />
        <Route path="stale-closure" element={<StaleClosure />} />
        <Route path="global-variable" element={<GlobalVariable />} />
        <Route path="detached-dom" element={<DetachedDOM />} />
        <Route path="modal-leak" element={<ModalLeak />} />
      </Route>
    </Routes>
  );
}

export default App;
