package com.recruitment.service;

import com.recruitment.config.FileStorageConfig;
import com.recruitment.dto.DocumentResponse;
import com.recruitment.entity.Document;
import com.recruitment.entity.DocumentType;
import com.recruitment.entity.User;
import com.recruitment.exception.FileStorageException;
import com.recruitment.exception.ResourceNotFoundException;
import com.recruitment.repository.DocumentRepository;
import com.recruitment.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final FileStorageConfig fileStorageConfig;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    private Path fileStoragePath;

    @PostConstruct
    public void init() {
        this.fileStoragePath = Paths.get(fileStorageConfig.getUploadDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStoragePath);
        } catch (IOException e) {
            throw new FileStorageException("Could not create upload directory", e);
        }
    }

    public DocumentResponse storeFile(MultipartFile file, Long userId, DocumentType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        if (originalFileName.contains("..")) {
            throw new FileStorageException("Filename contains invalid path sequence: " + originalFileName);
        }

        // Generate unique filename
        String fileExtension = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex > 0) {
            fileExtension = originalFileName.substring(dotIndex);
        }
        String storedFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            Path targetLocation = this.fileStoragePath.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Document document = Document.builder()
                    .fileName(originalFileName)
                    .filePath(storedFileName)
                    .type(type)
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .user(user)
                    .build();

            Document saved = documentRepository.save(document);
            return mapToResponse(saved);

        } catch (IOException e) {
            throw new FileStorageException("Could not store file " + originalFileName, e);
        }
    }

    public Resource loadFileAsResource(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", documentId));

        try {
            Path filePath = this.fileStoragePath.resolve(document.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new FileStorageException("File not found: " + document.getFileName());
            }
        } catch (MalformedURLException e) {
            throw new FileStorageException("File not found: " + document.getFileName(), e);
        }
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", id));
    }

    public List<DocumentResponse> getDocumentsByUser(Long userId) {
        return documentRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", documentId));

        try {
            Path filePath = this.fileStoragePath.resolve(document.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Could not delete file: " + document.getFileName(), e);
        }

        documentRepository.delete(document);
    }

    private DocumentResponse mapToResponse(Document doc) {
        return DocumentResponse.builder()
                .id(doc.getId())
                .fileName(doc.getFileName())
                .type(doc.getType())
                .fileSize(doc.getFileSize())
                .contentType(doc.getContentType())
                .uploadDate(doc.getUploadDate())
                .userId(doc.getUser().getId())
                .downloadUrl("/api/files/download/" + doc.getId())
                .build();
    }
}
