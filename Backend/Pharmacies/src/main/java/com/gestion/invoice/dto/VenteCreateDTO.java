package com.gestion.invoice.dto;

import lombok.Data;

@Data
public class VenteCreateDTO {
    private String codeTicket;
    private Long clientId; // optionnel au départ
}
