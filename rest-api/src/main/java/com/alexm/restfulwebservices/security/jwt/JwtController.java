 package com.alexm.restfulwebservices.security.jwt;


import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.oauth2.jwt.JwtEncoder;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JwtController {
	
	
	
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    

    public JwtController(JwtEncoder jwtEncoder, 
            AuthenticationManager authenticationManager, JwtTokenService jwtTokenService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JwtTokenResponse> generateToken(
            @RequestBody JwtTokenRequest jwtTokenRequest) {
        
        var authenticationToken = 
                new UsernamePasswordAuthenticationToken(
                			jwtTokenRequest.username(), jwtTokenRequest.password());
        
        var authentication = 
                authenticationManager.authenticate(authenticationToken);

        var token = jwtTokenService.generateToken(authentication);
        
        return ResponseEntity.ok(new JwtTokenResponse(token));
    }
    
}
