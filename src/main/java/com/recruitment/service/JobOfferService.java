package com.recruitment.service;

import com.recruitment.dto.JobOfferFilterRequest;
import com.recruitment.dto.JobOfferRequest;
import com.recruitment.dto.JobOfferResponse;
import com.recruitment.entity.JobOffer;
import com.recruitment.entity.User;
import com.recruitment.exception.ResourceNotFoundException;
import com.recruitment.repository.JobOfferRepository;
import com.recruitment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final UserRepository userRepository;

    public JobOfferResponse createJobOffer(JobOfferRequest request, Long recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", recruiterId));

        JobOffer jobOffer = JobOffer.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .contractType(request.getContractType())
                .salary(request.getSalary())
                .requirements(request.getRequirements())
                .expirationDate(request.getExpirationDate())
                .recruiter(recruiter)
                .isActive(true)
                .build();

        JobOffer saved = jobOfferRepository.save(jobOffer);
        return mapToResponse(saved);
    }

    public List<JobOfferResponse> getAllJobOffers() {
        return jobOfferRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobOfferResponse getJobOfferById(Long id) {
        JobOffer offer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "id", id));
        return mapToResponse(offer);
    }

    public List<JobOfferResponse> getJobOffersByRecruiter(Long recruiterId) {
        return jobOfferRepository.findByRecruiterId(recruiterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobOfferResponse updateJobOffer(Long id, JobOfferRequest request) {
        JobOffer offer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "id", id));

        if (request.getTitle() != null) offer.setTitle(request.getTitle());
        if (request.getDescription() != null) offer.setDescription(request.getDescription());
        if (request.getLocation() != null) offer.setLocation(request.getLocation());
        if (request.getContractType() != null) offer.setContractType(request.getContractType());
        if (request.getSalary() != null) offer.setSalary(request.getSalary());
        if (request.getRequirements() != null) offer.setRequirements(request.getRequirements());
        if (request.getExpirationDate() != null) offer.setExpirationDate(request.getExpirationDate());

        JobOffer saved = jobOfferRepository.save(offer);
        return mapToResponse(saved);
    }

    public void deleteJobOffer(Long id) {
        if (!jobOfferRepository.existsById(id)) {
            throw new ResourceNotFoundException("JobOffer", "id", id);
        }
        jobOfferRepository.deleteById(id);
    }

    public Page<JobOfferResponse> searchJobOffers(JobOfferFilterRequest filter) {
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), Sort.by("postedDate").descending());
        Page<JobOffer> page = jobOfferRepository.searchJobOffers(
                filter.getTitle(),
                filter.getLocation(),
                filter.getContractType(),
                filter.getMinSalary(),
                filter.getMaxSalary(),
                filter.getIsActive(),
                pageable
        );
        return page.map(this::mapToResponse);
    }

    private JobOfferResponse mapToResponse(JobOffer offer) {
        return JobOfferResponse.builder()
                .id(offer.getId())
                .title(offer.getTitle())
                .description(offer.getDescription())
                .location(offer.getLocation())
                .contractType(offer.getContractType())
                .salary(offer.getSalary())
                .requirements(offer.getRequirements())
                .postedDate(offer.getPostedDate())
                .expirationDate(offer.getExpirationDate())
                .isActive(offer.getIsActive())
                .recruiterId(offer.getRecruiter().getId())
                .recruiterName(offer.getRecruiter().getFirstName() + " " + offer.getRecruiter().getLastName())
                .createdAt(offer.getCreatedAt())
                .build();
    }
}
