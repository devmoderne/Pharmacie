package com.gestion.invoice.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.gestion.invoice.dto.LoginResponse;
import com.gestion.invoice.dto.UserToRole;
import com.gestion.invoice.models.AppRole;
import com.gestion.invoice.models.AppUser;
import com.gestion.invoice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Liste tous les utilisateurs → ADMIN uniquement
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<AppUser> getAllUsers() {
        return userService.listeUser();
    }

    // Ajouter un nouvel utilisateur → accessible à tous
    @PostMapping
    public AppUser addUser(@RequestBody AppUser user) {
        return userService.addUser(user);
    }

    // Ajouter un rôle → ADMIN uniquement
    @PostMapping("/roles")

    public AppRole addRole(@RequestBody AppRole role) {
        return userService.addRole(role);
    }

    // Associer un rôle à un utilisateur → ADMIN uniquement
    @PostMapping("/addRoleToUser")

    public void addRoleToUser(@RequestBody UserToRole userToRole) {
        userService.addUserToRole(userToRole.getTelephone(), userToRole.getRolName());
    }

    // Mettre à jour un utilisateur → ADMIN et USER
    @PutMapping("/{telephone}")

    public AppUser updateUser(@PathVariable String telephone, @RequestBody AppUser user) {
        return userService.updateUser(telephone, user);
    }

   /* // Supprimer un utilisateur → ADMIN uniquement (soft delete)
    @DeleteMapping("/{telephone}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteUser(@PathVariable String telephone) {
        userService.deleteUser(telephone);
    }*/

   /* @PostMapping("/auth/login")
    public AppUser login(@RequestBody Map<String, String> credentials) {
        String id=credentials.get("id");
        String telephone = credentials.get("telephone");
        String password = credentials.get("password");
        return userService.login(telephone, password);
    }*/
   @PostMapping("/auth/login")
   public LoginResponse login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
       String telephone = credentials.get("telephone");
       String password = credentials.get("password");

       AppUser user = userService.login(telephone, password); // Ton service vérifie password

       // ⚠️ Générer le token ici ou récupérer depuis JwtAuthenticationFilter
       Algorithm algorithm = Algorithm.HMAC256("MACLESECRETDE32caractereaumoinsjecrois!".getBytes());

       String accessToken = JWT.create()
               .withSubject(user.getTelephone())
               .withExpiresAt(new Date(System.currentTimeMillis() + 5 * 60 * 60 * 1000))
               .withIssuer(request.getRequestURL().toString())
               .withClaim("roles", user.getApproles().stream().map(r -> r.getRoleName()).toList())
               .sign(algorithm);

       String refreshToken = JWT.create()
               .withSubject(user.getTelephone())
               .withExpiresAt(new Date(System.currentTimeMillis() + 60 * 60 * 1000))
               .withIssuer(request.getRequestURL().toString())
               .sign(algorithm);

       LoginResponse response = new LoginResponse();
       response.setId(user.getId());
       response.setNom(user.getNom());
       response.setPrenoms(user.getPrenoms());
       response.setUsername(user.getTelephone());
       response.setRoles(user.getApproles().stream().map(r -> r.getRoleName()).toList());
       response.setAccess_token(accessToken);
       response.setRefresh_token(refreshToken);
         System.out.println("voici la reponse de response "+response);
       return response;
   }

    @PostMapping("/auth/change-password")
    public String changePassword(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String oldPassword = data.get("oldPassword");
        String newPassword = data.get("newPassword");
        userService.changePassword(username, oldPassword, newPassword);
        return "Mot de passe changé avec succès";
    }

}
