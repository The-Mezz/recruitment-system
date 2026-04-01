package com.recruitment.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class JobOfferFilterRequest {
    private String title;
    private String location;
    private String contractType;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private Boolean isActive;
    private int page = 0;
    private int size = 10;
}
