import React, { useState } from 'react';

function LoginPanel({ onComplete }) {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    onComplete(form.email);
  };

  return (
    <section className="panel auth-panel">
      <div>
        <h2>Login / Signup</h2>
        <p>Simple demo form for a recruiter-friendly project flow.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <button type="submit" className="primary-button">Continue</button>
      </form>
    </section>
  );
}

export default LoginPanel;
