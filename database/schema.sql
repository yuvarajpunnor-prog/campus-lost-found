-- ===================================================================
-- Campus Lost & Found Portal - Database Schema (MySQL 8.0)
-- ===================================================================

CREATE DATABASE IF NOT EXISTS campus_lost_found CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_lost_found;

-- 1. Users Table
DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Items Table (Lost & Found reports)
CREATE TABLE items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    type VARCHAR(10) NOT NULL, -- 'LOST' or 'FOUND'
    category VARCHAR(50) NOT NULL,
    description TEXT,
    item_date DATE,
    item_time VARCHAR(50),
    location VARCHAR(200) NOT NULL,
    color VARCHAR(50),
    brand VARCHAR(100),
    identifying_details TEXT,
    current_location VARCHAR(200), -- Where item is held (for found items)
    contact_info VARCHAR(100),
    image_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'CLAIMED', 'MATCHED', 'RETURNED', 'CLOSED'
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_items_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_item_type (type),
    INDEX idx_item_category (category),
    INDEX idx_item_status (status),
    INDEX idx_item_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Claims Table
CREATE TABLE claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    claimant_id BIGINT NOT NULL,
    claimant_name VARCHAR(100) NOT NULL,
    claimant_student_id VARCHAR(50) NOT NULL,
    claimant_phone VARCHAR(20) NOT NULL,
    reason TEXT NOT NULL,
    additional_details TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_claims_item FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE,
    CONSTRAINT fk_claims_claimant FOREIGN KEY (claimant_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_claim_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
