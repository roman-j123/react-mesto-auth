import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
export default function Register({ textButton, onRegister }) {
  const initialData = {
    email: '',
    password: ''
  }
  const [data, setData] = useState(initialData);
  const history = useHistory();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData(data => ({
      ...data,
      [name]: value,
    }));
  }
  const resetForm = () => {
    setData(initialData);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if(!data.email || !data.password) {
      return;
    }
    onRegister(data)
      .then(resetForm)
      .then(() => {
        history.push('/sign-in');
      })
      .catch(err => {
        console.log(`Error: ${err}`)
      })
  }
  return (
    <>
      <h2>Регистрация</h2>
    </>
  )
}