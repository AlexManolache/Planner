import { useEffect, useState } from "react";
import {
  retrievePlanByName,
  retrievePlanById,
  deletePlan,
} from "./api/PlannerApiService";
import { useAuth } from "./security/AuthContext";

import { useNavigate } from "react-router-dom";

export default function PlannerList() {
  const [plans, setPlans] = useState([]);
  const [id, setId] = useState("");

  const auth = useAuth();

  const navigate = useNavigate();

   function getPlanByName() {
    retrievePlanByName(auth.username)
      .then((date) => {
        setPlans(date.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  }

  function getPlanById() {
    retrievePlanById(auth.username, id)
      .then((date) => {
        setPlans(date.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  }

  function handlerSetId(event) {
    setId(event.target.value);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && id !== null && id !== "") {
      getPlanById();
    } else {
      getPlanByName();
    }
  }

  useEffect(() => {
    getPlanByName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function deletePlanById(id) {
    deletePlan(auth.username, id)
      .then(() => {
        getPlanByName();
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  }

  function updatePlan(id) {
    auth.setUpdatePlan(true);
    return navigate(`${id}/update`);
  }

  function addPlan() {
    auth.setUpdatePlan(false);
    return navigate("/plans/add");
  }

  return (
    <div className="container">
      <h1>List with plans</h1>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-3">
            <div className="d-flex justify-content-center">
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Search By Id"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                  value={id}
                  onChange={handlerSetId}
                  onKeyDown={handleKeyPress}
                />
                <button
                  className="btn btn-secondary ms-1"
                  type="button"
                  id="button-addon2"
                  onClick={addPlan}
                >
                  Add a Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <table className="table table-hover">
          <thead>
            <tr>
              <td>Id</td>
              <td>Username</td>
              <td>Description</td>
              <td>Target Done</td>
              <td>Done</td>
              <td>Update</td>
              <td>Delete</td>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.id}</td>
                <td>{plan.username}</td>
                <td>{plan.description}</td>
                <td>{plan.targetDate}</td>
                <td>{plan.done.toString()}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => updatePlan(plan.id)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deletePlanById(plan.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
