package com.alexm.restfulwebservices.planner;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class PlannerController {
	
	private PlannerRepo plannerRepo;
	
	public PlannerController(PlannerRepo plannerRepo) {
		this.plannerRepo = plannerRepo;
	}
	
	@GetMapping("/user/{username}/plans")
	public List<Planner> retrievePlans (@PathVariable ("username") String username) {
		
		return plannerRepo.findByUsername(username);
	}
	
	@GetMapping("/user/{username}/plans/{id}")
	public List<Planner> retrievePlansById (@PathVariable ("username") String username, @PathVariable ("id") int id) {
		List<Planner> plans = plannerRepo.findByUsername(username);
		return  plans.stream().filter(plan -> plan.getId() == id).collect(Collectors.toList());
	}
	
	@DeleteMapping("/user/{username}/plans/{id}")
	public ResponseEntity<Void> deletePlan(@PathVariable ("username") String username, @PathVariable ("id") int id) {
		plannerRepo.deleteById(id);
		return ResponseEntity.noContent().build();
	}
		
	@PostMapping("/user/{username}/plans")
	public ResponseEntity<Planner> createPlans(@PathVariable("username") String username, @Valid @RequestBody Planner planner) {
	   plannerRepo.save(planner);
	   
	  
	    URI location = ServletUriComponentsBuilder.fromCurrentRequest()
	            .path("/{id}")  
	            .buildAndExpand(planner.getId())  
	            .toUri();

	    return ResponseEntity.created(location).build();
	}
	
	@PutMapping("/user/{username}/plans/{id}")
	public Planner updatePlan(@PathVariable ("username") String username, @PathVariable ("id") int id, @Valid @RequestBody Planner updatedPlan) {
		return plannerRepo.save(updatedPlan);
	}
}
