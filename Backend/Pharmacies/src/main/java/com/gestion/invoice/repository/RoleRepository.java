package com.gestion.invoice.repository;


import com.gestion.invoice.models.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<AppRole,Long> {
    AppRole findByRoleName (String roleName);
}
