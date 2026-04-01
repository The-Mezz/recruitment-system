package com.recruitment.controller;

import com.recruitment.dto.InterviewRequest;
import com.recruitment.dto.InterviewResponse;
import com.recruitment.entity.User;
import com.recruitment.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
@Tag(name = "Interviews", description = "Interview scheduling and management")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Schedule a new interview (Recruiter only)")
    public ResponseEntity<InterviewResponse> createInterview(@Valid @RequestBody InterviewRequest request) {
        InterviewResponse response = interviewService.createInterview(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get interview by ID")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewById(id));
    }

    @GetMapping("/application/{applicationId}")
    @Operation(summary = "Get interviews for an application")
    public ResponseEntity<List<InterviewResponse>> getInterviewsByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(interviewService.getInterviewsByApplication(applicationId));
    }

    @GetMapping("/my-interviews")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Get my interviews (Candidate)")
    public ResponseEntity<List<InterviewResponse>> getMyInterviews(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(interviewService.getInterviewsByCandidate(currentUser.getId()));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get all interviews for recruiter's applications")
    public ResponseEntity<List<InterviewResponse>> getRecruiterInterviews(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(interviewService.getInterviewsByRecruiter(currentUser.getId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @Operation(summary = "Update an interview (status, feedback, schedule)")
    public ResponseEntity<InterviewResponse> updateInterview(
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest request) {
        return ResponseEntity.ok(interviewService.updateInterview(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @Operation(summary = "Delete an interview")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}
