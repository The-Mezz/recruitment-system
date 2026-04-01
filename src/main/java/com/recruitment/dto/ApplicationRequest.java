package com.recruitment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationRequest {

    @NotNull(message = "Job offer ID is required")
    private Long jobOfferId;

    private String coverLetter;
}
