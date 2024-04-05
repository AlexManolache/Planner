package com.alexm.restfulwebservices.planner;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PlannerRepo extends JpaRepository<Planner, Integer> {
	
	public List<Planner> findByUsername(String username);
}
