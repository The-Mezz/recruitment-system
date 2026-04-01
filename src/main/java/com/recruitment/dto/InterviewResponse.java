package com.recruitment.dto;

import com.recruitment.entity.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {
    private Long id;
    private LocalDateTime date;
    private InterviewStatus status;
    private String feedback;
    private String location;
    private String notes;
    private Long applicationId;
    private String candidateName;
    private String jobOfferTitle;
    private LocalDateTime createdAt;
}
