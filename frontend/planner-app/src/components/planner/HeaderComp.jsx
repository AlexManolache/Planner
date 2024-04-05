import { Link } from "react-router-dom";
import { useAuth } from "./security/AuthContext";
export default function HeaderComp() {
  const auth = useAuth();
  return (
    <header className="border-bottom border-light border-5 mb-5 p-2">
      <div className="container">
        <div className="row">
          <nav className="navbar navbar-expand-lg">
            {auth.isAuth && (
              // eslint-disable-next-line
              <a
                className="navbar-brand ms-2 fs-2 fw-bold text-black"
                href="https://github.com/AlexManolache?tab=repositories"
                target="_blank"
              >
                {auth.username}
              </a>
            )}
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav">
                {auth.isAuth && (
                  <li className="nav-item fs-5">
                    <Link className="nav-link" to="/welcome/alexm">
                      Home
                    </Link>
                  </li>
                )}
                {auth.isAuth && (
                  <li className="nav-item fs-5">
                    <Link className="nav-link" to="/plans">
                      Plans
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <ul className="navbar-nav">
              {!auth.isAuth && (
                <li className="nav-item fs-5">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
              {auth.isAuth && (
                <li className="nav-item fs-5">
                  <Link className="nav-link" to="/logout" onClick={auth.logout}>
                    Logout
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
