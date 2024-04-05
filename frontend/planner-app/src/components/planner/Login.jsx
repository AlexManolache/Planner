import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

export default function Login() {
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showError, setShowError] = useState(false);

  const navigation = useNavigate();

  function handlerUsername(event) {
    setUsername(event.target.value);
  }

  function handlerPassword(event) {
    setPassword(event.target.value);
  }

  async function isLogged(event) {
    event.preventDefault();
    if (await auth.login(username, password)) {

      setShowError(false);
      navigation(`/welcome/${username}`);
    } else {
      setShowError(true);
    }
  }

  return (
    <div>
      {auth === true && (
        <div className="success">Authenticated Successfully!</div>
      )}
      {showError === true && <div className="success">Not Authenticated!</div>}
      <form method="POST" className="container col-sm-3">
        <div>
          <label className="form-label">Username</label>
          <input
            className="form-control"
            type="text"
            name="username"
            value={username}
            onChange={handlerUsername}
            required
          />
        </div>
        <div>
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={password}
            onChange={handlerPassword}
            required
          />
        </div>
        <input className="btn btn-primary mb-3 mt-2" type="submit" value="Login" onClick={isLogged} />
      </form>
    </div>
  );
}
