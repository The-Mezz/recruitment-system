package com.recruitment.repository;

import com.recruitment.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByDateDesc(Long userId);

    List<Notification> findByUserIdAndIsReadFalseOrderByDateDesc(Long userId);

    long countByUserIdAndIsReadFalse(Long userId);
}
