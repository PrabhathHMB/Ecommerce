package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.modal.Address;

public interface AddressRepository extends MongoRepository<Address, String> {

}
