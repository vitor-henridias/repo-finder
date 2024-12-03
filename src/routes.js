import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Main from './pages/Main'
import Repositorio from './pages/Repositorio'

export default function PageRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/repositorio/:repositorio" element={<Repositorio />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
