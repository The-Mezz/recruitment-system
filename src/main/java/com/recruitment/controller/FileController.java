package com.recruitment.controller;

import com.recruitment.dto.DocumentResponse;
import com.recruitment.entity.Document;
import com.recruitment.entity.DocumentType;
import com.recruitment.entity.User;
import com.recruitment.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "Documents", description = "Document upload / download management")
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    @Operation(summary = "Upload a document (CV, Cover Letter, etc.)")
    public ResponseEntity<DocumentResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") DocumentType type,
            @AuthenticationPrincipal User currentUser) {
        DocumentResponse response = fileStorageService.storeFile(file, currentUser.getId(), type);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/download/{id}")
    @Operation(summary = "Download a document by ID")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Document document = fileStorageService.getDocumentById(id);
        Resource resource = fileStorageService.loadFileAsResource(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        document.getContentType() != null ? document.getContentType() : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "List documents for a user")
    public ResponseEntity<List<DocumentResponse>> getUserDocuments(@PathVariable Long userId) {
        return ResponseEntity.ok(fileStorageService.getDocumentsByUser(userId));
    }

    @GetMapping("/my-documents")
    @Operation(summary = "List my documents")
    public ResponseEntity<List<DocumentResponse>> getMyDocuments(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(fileStorageService.getDocumentsByUser(currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a document")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        fileStorageService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
