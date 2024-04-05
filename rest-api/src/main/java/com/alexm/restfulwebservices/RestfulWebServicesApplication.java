package com.alexm.restfulwebservices;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
public class RestfulWebServicesApplication {
	    
	public static void main(String[] args) {
		
		Dotenv dotenv = Dotenv.configure().load();
        
   
        String databaseUrl = dotenv.get("DATABASE");
        String username = dotenv.get("USERNAME_DB");
        String password = dotenv.get("PASSWORD_DB");
        
        System.setProperty("spring.datasource.url", databaseUrl);
        System.setProperty("spring.datasource.username", username);
        System.setProperty("spring.datasource.password", password);
		
		 SpringApplication.run(RestfulWebServicesApplication.class, args);
	}
	
	

}
