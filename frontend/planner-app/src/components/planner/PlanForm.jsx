import { useEffect, useState } from "react";
import { useAuth } from "./security/AuthContext";

import { useParams, useNavigate } from "react-router-dom";

import { addPlan, updatePlan, retrievePlanById } from "./api/PlannerApiService";

export default function PlanForm() {
  const auth = useAuth();

  const navigate = useNavigate();

  const { id } = useParams();

  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [done, setDone] = useState(false);

  function handlerDescription(event) {
    setDescription(event.target.value);
  }

  function handlerTargetDate(event) {
    setTargetDate(event.target.value);
  }

  function handlerDone(event) {
    setDone(event.target.checked);
  }

  function sendPlan(event) {
    event.preventDefault();
    const plan = {
      id: id,
      username: auth.username,
      description: description.trim(),
      targetDate: targetDate,
      done: done,
    };
    if (!plan.description || !plan.targetDate) {
      console.log("Description and target date are required");
      return;
    }

    if (auth.updatePlan === false) {
      addPlan(auth.username, plan)
        .then((respose) => {
          navigate("/plans");
        })
        .catch((err) => console.log(err))
        .finally(() => {});
    } else {
      updatePlan(auth.username, id, plan)
        .then((response) => {
          navigate("/plans");
        })
        .catch((err) => console.log(err))
        .finally(() => {});
    }
  }

  useEffect(() => {
    if (id && auth.updatePlan === true) {
      retrievePlanById(auth.username, id).then((plan) => {
        setDescription(plan.data[0].description || "");
        setTargetDate(plan.data[0].targetDate);
        setDone(!!plan.data[0].done);
      });
    }
  }, [id, auth.updatePlan, auth.username]);

  return (
    <div className="container col-sm-3">
      <form action={auth.updatePlan ? "PUT" : "POST"}>
        <div className="mb-3">
          <label className="form-label d-flex ms-0">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={handlerDescription}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label d-flex ms-0">Target Date</label>
          <input
            className="form-control"
            type="date"
            name="targetDate"
            value={targetDate}
            onChange={handlerTargetDate}
            required
          />
        </div>
        <div className="d-flex">
          <input
            type="checkbox"
            name="done"
            checked={done}
            onChange={handlerDone}
          />
          <label className="form-check-label">Done</label>
        </div>
        <div className="d-flex justify-content-between">
          <input
            className={
              "btn " + (auth.updatePlan ? "btn-warning" : "btn-secondary")
            }
            type="submit"
            value={(auth.updatePlan ? "Update" : "Add") + " Plan"}
            onClick={sendPlan}
          />
          <input
            className="btn btn-outline-secondary ms-1"
            type="button"
            value="Cancel"
            onClick={() => navigate("/plans")}
          />
        </div>
      </form>
    </div>
  );
}
