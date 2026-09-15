'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAdmin } from './actions';

const initialState = { status: null, pesan: '' };

function TombolMasuk() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Memproses...' : 'Masuk'}
    </button>
  );
}

export default function LoginForm({ redirectTo }) {
  const [state, formAction] = useFormState(loginAdmin, initialState);

  return (
    <form className="admin-login-form" action={formAction}>
      <input type="hidden" name="redirect" value={redirectTo} />

      {state.status && state.status !== 'sukses' && (
        <div className="alert alert-gagal">{state.pesan}</div>
      )}

      <label htmlFor="username">Username</label>
      <input type="text" id="username" name="username" placeholder="bos" required autoFocus />

      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" placeholder="*******" required />

      <TombolMasuk />
    </form>
  );
}
