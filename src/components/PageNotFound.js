import React from 'react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  const backStyle = {
    color: '#ffffff',
  }
  return (
    <>
      <h2>404</h2>
      <p>Страница не найдена. <Link style={backStyle} to="/">Назад</Link></p>
    </>
  )
}