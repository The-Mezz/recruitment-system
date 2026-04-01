package com.recruitment.dto;

import com.recruitment.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private ApplicationStatus status;
    private String coverLetter;
    private LocalDateTime appliedDate;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private Long jobOfferId;
    private String jobOfferTitle;
}
