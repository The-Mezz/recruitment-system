package com.recruitment.service;

import com.recruitment.dto.ApplicationRequest;
import com.recruitment.dto.ApplicationResponse;
import com.recruitment.entity.Application;
import com.recruitment.entity.ApplicationStatus;
import com.recruitment.entity.JobOffer;
import com.recruitment.entity.User;
import com.recruitment.exception.DuplicateResourceException;
import com.recruitment.exception.ResourceNotFoundException;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.JobOfferRepository;
import com.recruitment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobOfferRepository jobOfferRepository;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationResponse applyToJob(ApplicationRequest request, Long candidateId) {
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", candidateId));

        JobOffer jobOffer = jobOfferRepository.findById(request.getJobOfferId())
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "id", request.getJobOfferId()));

        if (!jobOffer.getIsActive()) {
            throw new IllegalArgumentException("This job offer is no longer active");
        }

        if (applicationRepository.existsByCandidateIdAndJobOfferId(candidateId, request.getJobOfferId())) {
            throw new DuplicateResourceException("You have already applied to this job offer");
        }

        Application application = Application.builder()
                .candidate(candidate)
                .jobOffer(jobOffer)
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.PENDING)
                .build();

        Application saved = applicationRepository.save(application);

        // Notify recruiter
        notificationService.sendNotification(
                jobOffer.getRecruiter().getId(),
                "New application received for: " + jobOffer.getTitle() + " from " +
                        candidate.getFirstName() + " " + candidate.getLastName(),
                "APPLICATION"
        );

        return mapToResponse(saved);
    }

    public List<ApplicationResponse> getApplicationsByCandidate(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsByJobOffer(Long jobOfferId) {
        return applicationRepository.findByJobOfferId(jobOfferId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsByRecruiter(Long recruiterId) {
        return applicationRepository.findByJobOfferRecruiterId(recruiterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));
        return mapToResponse(app);
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long id, ApplicationStatus status) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));

        app.setStatus(status);
        Application saved = applicationRepository.save(app);

        // Notify candidate about status change
        String statusMessage = switch (status) {
            case ACCEPTED -> "Congratulations! Your application for '" + app.getJobOffer().getTitle() + "' has been accepted!";
            case REJECTED -> "Your application for '" + app.getJobOffer().getTitle() + "' has been reviewed. Unfortunately, it was not selected.";
            default -> "Your application status for '" + app.getJobOffer().getTitle() + "' has been updated to: " + status;
        };

        notificationService.sendNotification(
                app.getCandidate().getId(),
                statusMessage,
                "APPLICATION_STATUS"
        );

        return mapToResponse(saved);
    }

    private ApplicationResponse mapToResponse(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .status(app.getStatus())
                .coverLetter(app.getCoverLetter())
                .appliedDate(app.getAppliedDate())
                .candidateId(app.getCandidate().getId())
                .candidateName(app.getCandidate().getFirstName() + " " + app.getCandidate().getLastName())
                .candidateEmail(app.getCandidate().getEmail())
                .jobOfferId(app.getJobOffer().getId())
                .jobOfferTitle(app.getJobOffer().getTitle())
                .build();
    }
}
