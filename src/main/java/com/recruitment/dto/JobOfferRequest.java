package com.recruitment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class JobOfferRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String location;
    private String contractType;
    private BigDecimal salary;
    private String requirements;
    private LocalDate expirationDate;
}
