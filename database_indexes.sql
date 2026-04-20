-- =====================================================
-- DATABASE PERFORMANCE INDEXES
-- Run these to speed up common queries
-- =====================================================

USE yc_interior;

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_deleted ON projects(deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured);
CREATE INDEX IF NOT EXISTS idx_services_deleted ON services(deleted_at);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(display_order);

-- Gallery indexes
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery(is_featured);
CREATE INDEX IF NOT EXISTS idx_gallery_deleted ON gallery(deleted_at);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(display_order);

-- Media indexes
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_subcategory ON media(sub_category);
CREATE INDEX IF NOT EXISTS idx_media_deleted ON media(deleted_at);
CREATE INDEX IF NOT EXISTS idx_media_uploaded ON media(uploaded_at DESC);

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_deleted ON posts(deleted_at);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at DESC);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_deleted ON reviews(deleted_at);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

-- Contact Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_deleted ON contact_messages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_messages_created ON contact_messages(created_at DESC);

-- Team Members indexes
CREATE INDEX IF NOT EXISTS idx_team_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_deleted ON team_members(deleted_at);

-- Clients indexes
CREATE INDEX IF NOT EXISTS idx_clients_deleted ON clients(deleted_at);

-- FAQs indexes
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_deleted ON faqs(deleted_at);

-- Statistics indexes
CREATE INDEX IF NOT EXISTS idx_statistics_order ON statistics(display_order);
CREATE INDEX IF NOT EXISTS idx_statistics_deleted ON statistics(deleted_at);

-- About Sections indexes
CREATE INDEX IF NOT EXISTS idx_about_type ON about_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_about_deleted ON about_sections(deleted_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_status_featured ON projects(status, is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_category_status ON projects(category_id, status);
CREATE INDEX IF NOT EXISTS idx_gallery_featured_order ON gallery(is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_services_featured_order ON services(is_featured, display_order);

-- Show all indexes
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'yc_interior'
GROUP BY TABLE_NAME, INDEX_NAME
ORDER BY TABLE_NAME, INDEX_NAME;
