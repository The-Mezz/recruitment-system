package com.recruitment.repository;

import com.recruitment.entity.Application;
import com.recruitment.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByCandidateId(Long candidateId);

    List<Application> findByJobOfferId(Long jobOfferId);

    List<Application> findByStatus(ApplicationStatus status);

    List<Application> findByJobOfferRecruiterIdAndStatus(Long recruiterId, ApplicationStatus status);

    List<Application> findByJobOfferRecruiterId(Long recruiterId);

    Optional<Application> findByCandidateIdAndJobOfferId(Long candidateId, Long jobOfferId);

    boolean existsByCandidateIdAndJobOfferId(Long candidateId, Long jobOfferId);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT FUNCTION('DATE_FORMAT', a.appliedDate, '%Y-%m') as month, COUNT(a) " +
           "FROM Application a GROUP BY FUNCTION('DATE_FORMAT', a.appliedDate, '%Y-%m') " +
           "ORDER BY month DESC")
    List<Object[]> countApplicationsByMonth();
}
