-- =====================================================
-- DATABASE
-- =====================================================
CREATE DATABASE IF NOT EXISTS yc_interior
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE yc_interior;

-- =====================================================
-- ADMINS (JWT AUTH)
-- =====================================================
CREATE TABLE admins (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    phone VARCHAR(50) NULL,
    avatar_media_id BIGINT UNSIGNED NULL,

    is_active BOOLEAN DEFAULT TRUE,

    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45) NULL,

    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_admin_email ON admins(email);

-- =====================================================
-- MEDIA (CENTRALIZED - IMAGE ONLY)
-- =====================================================
CREATE TABLE media (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    mime_type VARCHAR(100),

    category ENUM(
        'general',
        'project',
        'service',
        'gallery',
        'team',
        'client',
        'review',
        'about',
        'settings'
    ) DEFAULT 'general',

    sub_category VARCHAR(100) NULL,
    alt_text VARCHAR(255) NULL,

    uploaded_by BIGINT UNSIGNED NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (uploaded_by) REFERENCES admins(id) ON DELETE SET NULL
);

CREATE INDEX idx_media_category ON media(category);
CREATE INDEX idx_media_subcategory ON media(sub_category);
CREATE INDEX idx_media_category_subcategory ON media(category, sub_category);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);

-- Add FK after media exists
ALTER TABLE admins
ADD CONSTRAINT fk_admin_avatar
FOREIGN KEY (avatar_media_id) REFERENCES media(id) ON DELETE SET NULL;

-- =====================================================
-- SETTINGS
-- =====================================================
CREATE TABLE settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(255),

    logo_media_id BIGINT UNSIGNED,
    favicon_media_id BIGINT UNSIGNED,

    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    map_embed_url TEXT,

    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (logo_media_id) REFERENCES media(id) ON DELETE SET NULL,
    FOREIGN KEY (favicon_media_id) REFERENCES media(id) ON DELETE SET NULL
);

-- =====================================================
-- ABOUT
-- =====================================================
CREATE TABLE about_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,

    media_id BIGINT UNSIGNED,

    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL
);

-- =====================================================
-- SERVICES
-- =====================================================
CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,

    cover_media_id BIGINT UNSIGNED,

    status ENUM('draft', 'published') DEFAULT 'published',
    published_at TIMESTAMP NULL,

    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL
);

CREATE INDEX idx_services_display ON services(display_order);

CREATE TABLE service_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_id BIGINT NOT NULL,
    media_id BIGINT UNSIGNED,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- =====================================================
-- PROJECT CATEGORY
-- =====================================================
CREATE TABLE project_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- PROJECTS
-- =====================================================
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,

    cover_media_id BIGINT UNSIGNED,
    category_id BIGINT,

    status ENUM('draft', 'published') DEFAULT 'published',
    published_at TIMESTAMP NULL,

    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (category_id) REFERENCES project_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_display ON projects(display_order);

CREATE TABLE project_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    media_id BIGINT UNSIGNED,

    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- =====================================================
-- GALLERY
-- =====================================================
CREATE TABLE gallery (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255),
    media_id BIGINT UNSIGNED,

    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

CREATE INDEX idx_gallery_featured ON gallery(is_featured);
CREATE INDEX idx_gallery_display ON gallery(display_order);

-- =====================================================
-- STATISTICS
-- =====================================================
CREATE TABLE statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255),
    value INT,
    icon VARCHAR(255),

    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- FAQ
-- =====================================================
CREATE TABLE faqs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question TEXT,
    answer TEXT,

    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- CLIENTS
-- =====================================================
CREATE TABLE clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),

    logo_media_id BIGINT UNSIGNED,

    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (logo_media_id) REFERENCES media(id) ON DELETE SET NULL
);

-- =====================================================
-- REVIEWS
-- =====================================================
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    designation VARCHAR(255),

    rating INT CHECK (rating BETWEEN 1 AND 5),
    description TEXT,

    media_id BIGINT UNSIGNED,
    is_featured BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL
);

CREATE INDEX idx_reviews_featured ON reviews(is_featured);

-- =====================================================
-- TEAM MEMBERS
-- =====================================================
CREATE TABLE team_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    designation VARCHAR(255),

    media_id BIGINT UNSIGNED,

    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL
);

-- =====================================================
-- POST CATEGORY
-- =====================================================
CREATE TABLE post_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- POSTS
-- =====================================================
CREATE TABLE posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,

    cover_media_id BIGINT UNSIGNED,
    category_id BIGINT,

    status ENUM('draft', 'published') DEFAULT 'published',
    published_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES post_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL
);

CREATE INDEX idx_posts_slug ON posts(slug);

-- =====================================================
-- CONTACT MESSAGES
-- =====================================================
CREATE TABLE contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT,

    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);