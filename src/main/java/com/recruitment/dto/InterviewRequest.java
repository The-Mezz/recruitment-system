package com.recruitment.dto;

import com.recruitment.entity.InterviewStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InterviewRequest {

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Date is required")
    private LocalDateTime date;

    private String location;
    private String notes;
    private InterviewStatus status;
    private String feedback;
}
