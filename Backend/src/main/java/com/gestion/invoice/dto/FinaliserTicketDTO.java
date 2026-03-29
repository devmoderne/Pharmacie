package com.gestion.invoice.dto;

import lombok.Data;

@Data
public class FinaliserTicketDTO {
    private double tva;
    private double remise;
    private double remis;
    private double payer;
    // getters et setters
}