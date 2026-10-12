-- ===================================================================
-- Campus Lost & Found Portal - Sample Seed Data (MySQL)
-- Passwords below are hashed with BCrypt:
-- 'admin123'    -> $2a$10$wN0o0E.1yGZ7O8GZ2p8Z2O9H9Z2O9H9Z2O9H9Z2O9H9Z2O9H9Z2O9 (or generated during spring boot runner)
-- 'password123' -> $2a$10$76kY1n53/7lXnO2L4vM22.jX3Vl7KkH7I45B09RzV7qM8oV9sB0P2
-- ===================================================================

USE campus_lost_found;

-- Insert Users (admin: admin@campus.edu, students: rahul@campus.edu, priya@campus.edu, arjun@campus.edu)
INSERT INTO users (id, name, email, student_id, phone, password, role, created_at) VALUES
(1, 'Campus Administrator', 'admin@campus.edu', 'ADM-001', '+1-555-0100', '$2a$10$76kY1n53/7lXnO2L4vM22.jX3Vl7KkH7I45B09RzV7qM8oV9sB0P2', 'ROLE_ADMIN', NOW() - INTERVAL 30 DAY),
(2, 'Rahul Sharma', 'rahul@campus.edu', 'CS2024-042', '+1-555-0142', '$2a$10$76kY1n53/7lXnO2L4vM22.jX3Vl7KkH7I45B09RzV7qM8oV9sB0P2', 'ROLE_STUDENT', NOW() - INTERVAL 20 DAY),
(3, 'Priya Patel', 'priya@campus.edu', 'EE2023-018', '+1-555-0118', '$2a$10$76kY1n53/7lXnO2L4vM22.jX3Vl7KkH7I45B09RzV7qM8oV9sB0P2', 'ROLE_STUDENT', NOW() - INTERVAL 15 DAY),
(4, 'Arjun Verma', 'arjun@campus.edu', 'ME2024-089', '+1-555-0189', '$2a$10$76kY1n53/7lXnO2L4vM22.jX3Vl7KkH7I45B09RzV7qM8oV9sB0P2', 'ROLE_STUDENT', NOW() - INTERVAL 10 DAY);

-- Insert Items
INSERT INTO items (id, item_name, type, category, description, item_date, item_time, location, color, brand, identifying_details, current_location, contact_info, image_url, status, user_id, created_at) VALUES
(1, 'Black Boat Rockerz Earphones', 'FOUND', 'Electronics', 'Found on table 4 in the 2nd-floor reading area. Kept securely at the library desk.', CURDATE() - INTERVAL 2 DAY, '03:30 PM', 'Central Library 2nd Floor', 'Black', 'Boat', 'Slight scratch on the left earpiece button.', 'Library Main Reception Desk', 'librarian@campus.edu', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', 'ACTIVE', 3, NOW() - INTERVAL 2 DAY),
(2, 'Black Boat Earphones', 'LOST', 'Electronics', 'Lost during group study session near library window desks. Has sentimental value.', CURDATE() - INTERVAL 2 DAY, '03:00 PM', 'Central Library', 'Black', 'Boat', 'Black neckband with silver logo.', NULL, '+1-555-0142', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', 'ACTIVE', 2, NOW() - INTERVAL 2 DAY),
(3, 'Campus Student ID Card', 'FOUND', 'ID Cards', 'Student identity card found near cafeteria checkout counter.', CURDATE() - INTERVAL 1 DAY, '01:15 PM', 'Campus Cafeteria Food Court', 'Blue', 'College Issued', 'Department of Mechanical Engineering, ID ending in 089.', 'Campus Security Post Gate 1', 'security@campus.edu', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', 'ACTIVE', 2, NOW() - INTERVAL 1 DAY),
(4, 'Casio Vintage Digital Watch', 'FOUND', 'Accessories', 'Found on the bench beside the outdoor basketball court after evening match.', CURDATE() - INTERVAL 3 DAY, '05:45 PM', 'Sports Complex Basketball Court', 'Silver', 'Casio', 'Stainless steel band, minor scuff on top bezel.', 'Sports Department In-charge Room 102', '+1-555-0189', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', 'ACTIVE', 4, NOW() - INTERVAL 3 DAY),
(5, 'HP 65W Laptop Charger', 'LOST', 'Electronics', 'Left behind after CS lab practical session. Urgent needed for semester exam preparation.', CURDATE() - INTERVAL 4 DAY, '11:30 AM', 'Computer Lab 3 Block C', 'Black', 'HP', 'Blue tip barrel connector with yellow sticker label.', NULL, '+1-555-0118', 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80', 'ACTIVE', 3, NOW() - INTERVAL 4 DAY),
(6, 'Blue Skybags Laptop Backpack', 'FOUND', 'Bags', 'Found left on the back row seat after the guest lecture in Seminar Hall 2.', CURDATE() - INTERVAL 5 DAY, '04:00 PM', 'Seminar Hall 2 Admin Block', 'Blue', 'Skybags', 'Has a NASA keychain attached to the front pocket zip.', 'Admin Office Enquiry Counter', 'admin@campus.edu', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', 'RETURNED', 1, NOW() - INTERVAL 5 DAY),
(7, 'Chemistry Lab Record Notebook', 'LOST', 'Books', 'Spiral-bound chemistry lab record book with blue hard cover.', CURDATE() - INTERVAL 1 DAY, '02:00 PM', 'Chemistry Block Room 204', 'Blue', 'College Stationery', 'Roll Number CS2024-042 written on the index page.', NULL, '+1-555-0142', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80', 'ACTIVE', 2, NOW() - INTERVAL 1 DAY),
(8, 'Brown Leather Fossil Wallet', 'FOUND', 'Accessories', 'Found under the bench in the campus garden pathway.', CURDATE() - INTERVAL 3 DAY, '12:45 PM', 'Campus Main Garden', 'Brown', 'Fossil', 'Contains campus transit card and coins. Kept safely.', 'Student Affairs Office Room 12', 'affairs@campus.edu', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80', 'ACTIVE', 4, NOW() - INTERVAL 3 DAY);

-- Insert Sample Claim
INSERT INTO claims (id, item_id, claimant_id, claimant_name, claimant_student_id, claimant_phone, reason, additional_details, status, created_at) VALUES
(1, 4, 3, 'Priya Patel', 'EE2023-018', '+1-555-0118', 'I lost my silver Casio vintage watch during practice on Tuesday evening.', 'The watch display has a 24-hour mode enabled, and there is a small scratch near the top right button.', 'PENDING', NOW() - INTERVAL 1 DAY);
