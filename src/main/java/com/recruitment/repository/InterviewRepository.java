package com.recruitment.repository;

import com.recruitment.entity.Interview;
import com.recruitment.entity.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByApplicationId(Long applicationId);

    List<Interview> findByStatus(InterviewStatus status);

    List<Interview> findByApplicationCandidateId(Long candidateId);

    List<Interview> findByApplicationJobOfferRecruiterId(Long recruiterId);
}
