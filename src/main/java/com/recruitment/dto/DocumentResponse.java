package com.recruitment.dto;

import com.recruitment.entity.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private Long id;
    private String fileName;
    private DocumentType type;
    private Long fileSize;
    private String contentType;
    private LocalDateTime uploadDate;
    private Long userId;
    private String downloadUrl;
}
