-- Add width, height, and aspect_ratio columns to media table
ALTER TABLE media 
ADD COLUMN width INT NULL AFTER alt_text,
ADD COLUMN height INT NULL AFTER width,
ADD COLUMN aspect_ratio VARCHAR(20) NULL AFTER height;

-- Add index for aspect_ratio for faster filtering
CREATE INDEX idx_media_aspect_ratio ON media(aspect_ratio);
