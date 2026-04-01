package com.recruitment.service;

import com.recruitment.dto.DashboardStats;
import com.recruitment.entity.ApplicationStatus;
import com.recruitment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final JobOfferRepository jobOfferRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;

    public DashboardStats getStats() {
        // Applications by month
        Map<String, Long> applicationsByMonth = new LinkedHashMap<>();
        List<Object[]> monthlyData = applicationRepository.countApplicationsByMonth();
        for (Object[] row : monthlyData) {
            applicationsByMonth.put((String) row[0], (Long) row[1]);
        }

        // Top recruiters
        Map<String, Long> topRecruiters = new LinkedHashMap<>();
        List<Object[]> recruiterData = jobOfferRepository.findTopRecruiters(PageRequest.of(0, 5));
        for (Object[] row : recruiterData) {
            String name = row[0] + " " + row[1];
            topRecruiters.put(name, (Long) row[2]);
        }

        return DashboardStats.builder()
                .totalUsers(userRepository.count())
                .totalJobOffers(jobOfferRepository.count())
                .activeJobOffers(jobOfferRepository.countByIsActiveTrue())
                .totalApplications(applicationRepository.count())
                .pendingApplications(applicationRepository.countByStatus(ApplicationStatus.PENDING))
                .acceptedApplications(applicationRepository.countByStatus(ApplicationStatus.ACCEPTED))
                .rejectedApplications(applicationRepository.countByStatus(ApplicationStatus.REJECTED))
                .totalInterviews(interviewRepository.count())
                .applicationsByMonth(applicationsByMonth)
                .topRecruiters(topRecruiters)
                .build();
    }
}
