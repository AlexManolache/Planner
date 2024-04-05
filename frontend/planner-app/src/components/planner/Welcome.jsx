import { Link, useParams } from "react-router-dom";

export default function Welcome() {
  const { username } = useParams();


  return (
    <div>
      Welcome {username}
      <Link to="/plans" className="text-decoration-none text-outline-info ms-1">
        See list of plans!
      </Link>
    </div>
  );
}
