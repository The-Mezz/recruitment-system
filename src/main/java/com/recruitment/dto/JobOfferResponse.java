package com.recruitment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobOfferResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String contractType;
    private BigDecimal salary;
    private String requirements;
    private LocalDate postedDate;
    private LocalDate expirationDate;
    private Boolean isActive;
    private Long recruiterId;
    private String recruiterName;
    private LocalDateTime createdAt;
}
