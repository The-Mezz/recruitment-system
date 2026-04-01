package com.recruitment.controller;

import com.recruitment.dto.JobOfferFilterRequest;
import com.recruitment.dto.JobOfferRequest;
import com.recruitment.dto.JobOfferResponse;
import com.recruitment.entity.User;
import com.recruitment.service.JobOfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-offers")
@RequiredArgsConstructor
@Tag(name = "Job Offers", description = "Job offer management")
public class JobOfferController {

    private final JobOfferService jobOfferService;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Create a new job offer (Recruiter only)")
    public ResponseEntity<JobOfferResponse> createJobOffer(
            @Valid @RequestBody JobOfferRequest request,
            @AuthenticationPrincipal User currentUser) {
        JobOfferResponse response = jobOfferService.createJobOffer(request, currentUser.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all job offers (public)")
    public ResponseEntity<List<JobOfferResponse>> getAllJobOffers() {
        return ResponseEntity.ok(jobOfferService.getAllJobOffers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job offer by ID (public)")
    public ResponseEntity<JobOfferResponse> getJobOfferById(@PathVariable Long id) {
        return ResponseEntity.ok(jobOfferService.getJobOfferById(id));
    }

    @GetMapping("/recruiter/{recruiterId}")
    @Operation(summary = "Get job offers by recruiter")
    public ResponseEntity<List<JobOfferResponse>> getJobOffersByRecruiter(@PathVariable Long recruiterId) {
        return ResponseEntity.ok(jobOfferService.getJobOffersByRecruiter(recruiterId));
    }

    @GetMapping("/search")
    @Operation(summary = "Search job offers with filters and pagination")
    public ResponseEntity<Page<JobOfferResponse>> searchJobOffers(JobOfferFilterRequest filter) {
        return ResponseEntity.ok(jobOfferService.searchJobOffers(filter));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @Operation(summary = "Update a job offer")
    public ResponseEntity<JobOfferResponse> updateJobOffer(
            @PathVariable Long id,
            @Valid @RequestBody JobOfferRequest request) {
        return ResponseEntity.ok(jobOfferService.updateJobOffer(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @Operation(summary = "Delete a job offer")
    public ResponseEntity<Void> deleteJobOffer(@PathVariable Long id) {
        jobOfferService.deleteJobOffer(id);
        return ResponseEntity.noContent().build();
    }
}
