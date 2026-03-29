package com.gestion.invoice.service;


import com.gestion.invoice.models.AppRole;
import com.gestion.invoice.models.AppUser;
import com.gestion.invoice.models.Vente;

import java.util.List;


public interface UserService {
    AppUser addUser(AppUser newUser);
    AppRole addRole(AppRole role);
    AppUser findByTelephone(String telephone);
    void addUserToRole(String telephone,String roleName);
    AppUser LoadAppUserByTelephone(String telephone);
    List<AppUser> listeUser();
    AppUser updateUser(String telephone, AppUser user);
    AppRole getRole(String roleName);
    AppUser getUser(String telephone);
    AppUser login(String telephone, String password);
    void changePassword(String username, String oldPassword, String newPassword);


}
