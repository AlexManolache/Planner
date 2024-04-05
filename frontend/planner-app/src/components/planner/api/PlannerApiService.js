import { apiClient } from "./ApiClient";

export function retrievePlanByName(username) {
  return apiClient.get(`/user/${username}/plans`);
}

export function retrievePlanById(username, id) {
  return apiClient.get(`/user/${username}/plans/${id}`);
}

export function deletePlan(username, id) {
  return apiClient.delete(`/user/${username}/plans/${id}`);
}

export function addPlan(username, plan) {
  return apiClient.post(`/user/${username}/plans`, plan);
}

export function updatePlan(username, id, plan) {
  return apiClient.put(`/user/${username}/plans/${id}`, plan);
}
