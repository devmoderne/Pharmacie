package com.gestion.invoice.repository;


import com.gestion.invoice.models.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser,Long> {
    AppUser findByTelephone(String telephone);

}