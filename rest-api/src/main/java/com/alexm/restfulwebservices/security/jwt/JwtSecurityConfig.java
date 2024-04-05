package com.alexm.restfulwebservices.security.jwt;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;
import java.util.function.Function;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class JwtSecurityConfig {
	
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, HandlerMappingIntrospector introspector) throws Exception {
		var corsSource = corsFilter();
	    return httpSecurity
	    		.cors(t -> t.configurationSource(corsSource))
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers("/authenticate").permitAll()
	                .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
	                .anyRequest().authenticated())
	            .csrf(AbstractHttpConfigurer::disable)
	            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	            .oauth2ResourceServer((oauth2ResourceServer) ->
 				oauth2ResourceServer
 					.jwt((jwt) ->
 						{
							try {
								jwt
									.decoder(jwtDecoder());
							} catch (JOSEException e) {
								e.printStackTrace();
							}
						}
 					)
 			)

	            .httpBasic(Customizer.withDefaults())
	            .headers(header -> header.frameOptions(fr -> fr.sameOrigin()))
	            .build();
	}
	
	
	@Bean
	public UrlBasedCorsConfigurationSource corsFilter() {
		Dotenv dotenv = Dotenv.load();
		String allowedOrg = dotenv.get("ALLOWED_ORIGIN");
		CorsConfiguration corsConfig = new CorsConfiguration();
		corsConfig.addAllowedOrigin(allowedOrg);
		corsConfig.addAllowedMethod("*");
		corsConfig.addAllowedHeader("*");

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", corsConfig);
		
	    return source;
	}
	
	

	@Bean
	public PasswordEncoder passEncoder() {
	    return new BCryptPasswordEncoder();
	}

	@Bean
	public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
		Dotenv dotenv = Dotenv.load();
	    String username = dotenv.get("USERNAME_USER");
	    String password = dotenv.get("PASSWORD_USER");
	    
	    UserDetails user = User.builder()
	            .username(username)
	            .password("{bcrypt}" + passwordEncoder.encode(password))
	            .authorities("read")
	            .roles("USER")
	            .build();

	    return new InMemoryUserDetailsManager(user);
	}
    
    
    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsService) {
        var authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        return new ProviderManager(authenticationProvider);
    }
    

    @Bean
    public JWKSource<SecurityContext> jwkSource() {
        JWKSet jwkSet = new JWKSet(rsaKey());
        return (((jwkSelector, securityContext) 
                        -> jwkSelector.select(jwkSet)));
    }

    @Bean
    JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) {
        return new NimbusJwtEncoder(jwkSource);
    }

    @Bean
    JwtDecoder jwtDecoder() throws JOSEException {
        return NimbusJwtDecoder
                .withPublicKey(rsaKey().toRSAPublicKey())
                .build();
    }
    
    @Bean
    public RSAKey rsaKey() {
        
        KeyPair keyPair = keyPair();
        
        return new RSAKey
                .Builder((RSAPublicKey) keyPair.getPublic())
                .privateKey((RSAPrivateKey) keyPair.getPrivate())
                .keyID(UUID.randomUUID().toString())
                .build();
    }

    @Bean
    public KeyPair keyPair() {
        try {
            var keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            return keyPairGenerator.generateKeyPair();
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Unable to generate an RSA Key Pair", e);
        }
    }
    
}
