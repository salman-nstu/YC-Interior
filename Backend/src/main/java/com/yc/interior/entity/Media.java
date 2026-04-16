package com.yc.interior.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "media")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "mime_type")
    private String mimeType;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('general','project','service','gallery','team','client','review','about','settings') DEFAULT 'general'")
    private MediaCategory category = MediaCategory.general;

    @Column(name = "sub_category")
    private String subCategory;

    @Column(name = "alt_text")
    private String altText;

    @Column(name = "uploaded_by")
    private Long uploadedBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum MediaCategory {
        general, project, service, gallery, team, client, review, about, settings
    }
}
