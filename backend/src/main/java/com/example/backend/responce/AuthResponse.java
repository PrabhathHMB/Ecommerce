package com.example.backend.responce;

public class AuthResponse {

	private String jwt;

	private boolean status;
	
	private String message;

	public AuthResponse() {
		
	}

	public AuthResponse(String jwt, boolean status) {
		super();
		this.jwt = jwt;
		this.status = status;
	}

	public String getJwt() {
		return jwt;
	}

	public void setJwt(String jwt) {
		this.jwt = jwt;
	}

	public boolean getStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
