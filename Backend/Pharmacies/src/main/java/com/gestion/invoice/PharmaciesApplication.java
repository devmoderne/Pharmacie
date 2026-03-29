package com.gestion.invoice;

import com.gestion.invoice.models.AppRole;
import com.gestion.invoice.models.AppUser;
import com.gestion.invoice.service.impl.UserServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import java.util.ArrayList;

@SpringBootApplication(scanBasePackages = {
        "com.gestion.invoice",  // Pharmacies
        "com.project.sign"      // Sign
})

    @EnableMethodSecurity
    public class PharmaciesApplication {
        public static void main(String[] args) {
            SpringApplication.run(PharmaciesApplication.class, args);
        }
 /*   @Bean



    CommandLineRunner start(UserServiceImpl accountUser) {
        return args -> {
            if(accountUser.getRole("USER") == null) accountUser.addRole(new AppRole(null, "USER"));
            if(accountUser.getRole("ADMIN") == null) accountUser.addRole(new AppRole(null, "ADMIN"));
            if(accountUser.getRole("SUPER_ADMIN") == null) accountUser.addRole(new AppRole(null, "SUPER_ADMIN"));

            if(accountUser.getUser("95064366") == null)
                accountUser.addUser(new AppUser(null, "IWIKOTAN", "thierry", "95064366", "123", new ArrayList<>()));
            if(accountUser.getUser("80167188") == null)
                accountUser.addUser(new AppUser(null, "IWIKOTAN", "Landry", "80167188", "123", new ArrayList<>()));
            if(accountUser.getUser("85536173") == null)
                accountUser.addUser(new AppUser(null, "IWIKOTAN", "smith", "85536173", "123", new ArrayList<>()));


            accountUser.addUserToRole("95064366", "USER");
            accountUser.addUserToRole("95064366", "ADMIN");
            accountUser.addUserToRole("80167188", "ADMIN");
        };
    }
*/

}

/* SELECT p.nom,
       SUM(e.quantite * e.prixAchat) AS cout_total_achat,
       SUM(d.quantite * p.prixVente) AS revenus_total_vente,
       SUM(d.quantite * (p.prixVente - e.prixAchat)) AS benefice_total
FROM produits p
JOIN entrees_stock e ON e.produit_id = p.id
JOIN details_ventes d ON d.produit_id = p.id
GROUP BY p.nom;*/