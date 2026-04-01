package com.recruitment.service;

import com.recruitment.dto.InterviewRequest;
import com.recruitment.dto.InterviewResponse;
import com.recruitment.entity.Application;
import com.recruitment.entity.Interview;
import com.recruitment.entity.InterviewStatus;
import com.recruitment.exception.ResourceNotFoundException;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    @Transactional
    public InterviewResponse createInterview(InterviewRequest request) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));

        Interview interview = Interview.builder()
                .date(request.getDate())
                .status(InterviewStatus.SCHEDULED)
                .location(request.getLocation())
                .notes(request.getNotes())
                .application(application)
                .build();

        Interview saved = interviewRepository.save(interview);

        // Notify candidate about interview
        notificationService.sendNotification(
                application.getCandidate().getId(),
                "An interview has been scheduled for your application to '" +
                        application.getJobOffer().getTitle() + "' on " + request.getDate(),
                "INTERVIEW"
        );

        return mapToResponse(saved);
    }

    public InterviewResponse getInterviewById(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", id));
        return mapToResponse(interview);
    }

    public List<InterviewResponse> getInterviewsByApplication(Long applicationId) {
        return interviewRepository.findByApplicationId(applicationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<InterviewResponse> getInterviewsByCandidate(Long candidateId) {
        return interviewRepository.findByApplicationCandidateId(candidateId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<InterviewResponse> getInterviewsByRecruiter(Long recruiterId) {
        return interviewRepository.findByApplicationJobOfferRecruiterId(recruiterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InterviewResponse updateInterview(Long id, InterviewRequest request) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", id));

        if (request.getDate() != null) interview.setDate(request.getDate());
        if (request.getStatus() != null) interview.setStatus(request.getStatus());
        if (request.getFeedback() != null) interview.setFeedback(request.getFeedback());
        if (request.getLocation() != null) interview.setLocation(request.getLocation());
        if (request.getNotes() != null) interview.setNotes(request.getNotes());

        Interview saved = interviewRepository.save(interview);

        // Notify candidate about interview update
        notificationService.sendNotification(
                interview.getApplication().getCandidate().getId(),
                "Your interview for '" + interview.getApplication().getJobOffer().getTitle() +
                        "' has been updated. Status: " + saved.getStatus(),
                "INTERVIEW_UPDATE"
        );

        return mapToResponse(saved);
    }

    public void deleteInterview(Long id) {
        if (!interviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Interview", "id", id);
        }
        interviewRepository.deleteById(id);
    }

    private InterviewResponse mapToResponse(Interview interview) {
        return InterviewResponse.builder()
                .id(interview.getId())
                .date(interview.getDate())
                .status(interview.getStatus())
                .feedback(interview.getFeedback())
                .location(interview.getLocation())
                .notes(interview.getNotes())
                .applicationId(interview.getApplication().getId())
                .candidateName(interview.getApplication().getCandidate().getFirstName() + " " +
                        interview.getApplication().getCandidate().getLastName())
                .jobOfferTitle(interview.getApplication().getJobOffer().getTitle())
                .createdAt(interview.getCreatedAt())
                .build();
    }
}
