package com.recruitment.repository;

import com.recruitment.entity.JobOffer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    List<JobOffer> findByRecruiterId(Long recruiterId);

    List<JobOffer> findByIsActiveTrue();

    long countByIsActiveTrue();

    @Query("SELECT j FROM JobOffer j WHERE " +
           "(:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:contractType IS NULL OR LOWER(j.contractType) = LOWER(:contractType)) AND " +
           "(:minSalary IS NULL OR j.salary >= :minSalary) AND " +
           "(:maxSalary IS NULL OR j.salary <= :maxSalary) AND " +
           "(:isActive IS NULL OR j.isActive = :isActive)")
    Page<JobOffer> searchJobOffers(
            @Param("title") String title,
            @Param("location") String location,
            @Param("contractType") String contractType,
            @Param("minSalary") BigDecimal minSalary,
            @Param("maxSalary") BigDecimal maxSalary,
            @Param("isActive") Boolean isActive,
            Pageable pageable
    );

    @Query("SELECT j.recruiter.firstName, j.recruiter.lastName, COUNT(j) as cnt FROM JobOffer j " +
           "GROUP BY j.recruiter.id, j.recruiter.firstName, j.recruiter.lastName ORDER BY cnt DESC")
    List<Object[]> findTopRecruiters(Pageable pageable);
}
