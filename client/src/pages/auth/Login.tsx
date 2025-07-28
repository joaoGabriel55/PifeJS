import { useAuth } from "../../hooks/useAuth";
import "./Login.css";

export default function LoginPage() {
  const { onLogin } = useAuth();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const email = form.email.value;
    const password = form.password.value;

    onLogin({ email, password });
  };

  return (
    <div className="login-page">
      <h1 className="login-title">Login</h1>
      <p className="login-description">Please log in to access your account.</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <input id="email" name="email" type="email" placeholder="Email" autoComplete="email" />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
