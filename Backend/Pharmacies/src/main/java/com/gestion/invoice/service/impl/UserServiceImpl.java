package com.gestion.invoice.service.impl;


import com.gestion.invoice.models.AppRole;
import com.gestion.invoice.models.AppUser;
import com.gestion.invoice.repository.RoleRepository;
import com.gestion.invoice.repository.UserRepository;
import com.gestion.invoice.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AppUser addUser(AppUser user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRoleId() != null) {
            AppRole role = roleRepository.findById(user.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Rôle introuvable"));
            user.getApproles().add(role);
        } else {
            AppRole userRole = roleRepository.findByRoleName("USER");
            user.getApproles().add(userRole);
        }

        return userRepository.save(user);
    }

    @Override
    public AppRole addRole(AppRole role) {
        return roleRepository.save(role);
    }

    @Override
    public AppUser updateUser(String telephone, AppUser user) {
        AppUser existingUser = userRepository.findByTelephone(telephone);
        if (existingUser != null) {
            existingUser.setNom(user.getNom());
            existingUser.setPrenoms(user.getPrenoms());
            return userRepository.save(existingUser);
        }
        return null;
    }

    @Override
    public AppRole getRole(String roleName) {
        return roleRepository.findByRoleName(roleName);
    }

    @Override
    public AppUser getUser(String telephone) {
        return userRepository.findByTelephone(telephone);
    }

    @Override
    public List<AppUser> listeUser() {
        return userRepository.findAll();
    }

    @Override
    public void addUserToRole(String telephone, String roleName) {
        AppUser user = userRepository.findByTelephone(telephone);
        AppRole role = roleRepository.findByRoleName(roleName);
        if (user != null && role != null) {
            user.getApproles().add(role);
            userRepository.save(user);
        }
    }

    @Override
    public AppUser LoadAppUserByTelephone(String telephone) {
        return userRepository.findByTelephone(telephone);
    }

    @Override
    public AppUser findByTelephone(String telephone) {
        return userRepository.findByTelephone(telephone);
    }

    @Override
    public AppUser login(String telephone, String password) {
        AppUser user = userRepository.findByTelephone(telephone);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        throw new RuntimeException("Téléphone ou mot de passe incorrect");
    }

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
        AppUser user = userRepository.findByTelephone(username);
        if (user != null && passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } else {
            throw new RuntimeException("Mot de passe actuel incorrect ou utilisateur introuvable");
        }
    }
}
