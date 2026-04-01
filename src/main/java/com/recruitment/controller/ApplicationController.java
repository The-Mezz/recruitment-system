package com.recruitment.controller;

import com.recruitment.dto.ApplicationRequest;
import com.recruitment.dto.ApplicationResponse;
import com.recruitment.dto.ApplicationStatusRequest;
import com.recruitment.entity.User;
import com.recruitment.service.ApplicationService;
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
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Job application management")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Apply to a job offer (Candidate only)")
    public ResponseEntity<ApplicationResponse> apply(
            @Valid @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal User currentUser) {
        ApplicationResponse response = applicationService.applyToJob(request, currentUser.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application by ID")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Get my applications (Candidate)")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(applicationService.getApplicationsByCandidate(currentUser.getId()));
    }

    @GetMapping("/job-offer/{jobOfferId}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @Operation(summary = "Get applications for a job offer")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByJobOffer(@PathVariable Long jobOfferId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobOffer(jobOfferId));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get all applications for recruiter's job offers")
    public ResponseEntity<List<ApplicationResponse>> getRecruiterApplications(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(applicationService.getApplicationsByRecruiter(currentUser.getId()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @Operation(summary = "Update application status (Recruiter/Admin)")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusRequest request) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, request.getStatus()));
    }
}
