package com.campus.lostfound.config;

import com.campus.lostfound.entity.Claim;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.repository.ClaimRepository;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already exists
        }

        // 1. Create Admin Account
        User admin = new User(
                "Campus Administrator",
                "admin@campus.edu",
                "ADM-001",
                "+1-555-0100",
                passwordEncoder.encode("admin123"),
                "ROLE_ADMIN"
        );
        admin.setCreatedAt(LocalDateTime.now().minusDays(30));
        admin = userRepository.save(admin);

        // 2. Create Student Accounts
        User student1 = new User(
                "Rahul Sharma",
                "rahul@campus.edu",
                "CS2024-042",
                "+1-555-0142",
                passwordEncoder.encode("password123"),
                "ROLE_STUDENT"
        );
        student1.setCreatedAt(LocalDateTime.now().minusDays(20));
        student1 = userRepository.save(student1);

        User student2 = new User(
                "Priya Patel",
                "priya@campus.edu",
                "EE2023-018",
                "+1-555-0118",
                passwordEncoder.encode("password123"),
                "ROLE_STUDENT"
        );
        student2.setCreatedAt(LocalDateTime.now().minusDays(15));
        student2 = userRepository.save(student2);

        User student3 = new User(
                "Arjun Verma",
                "arjun@campus.edu",
                "ME2024-089",
                "+1-555-0189",
                passwordEncoder.encode("password123"),
                "ROLE_STUDENT"
        );
        student3.setCreatedAt(LocalDateTime.now().minusDays(10));
        student3 = userRepository.save(student3);

        // 3. Create Sample Items (Found & Lost)
        // Item 1: Found Boat Earphones (Matches with Item 2 Lost)
        Item item1 = new Item();
        item1.setItemName("Black Boat Rockerz Earphones");
        item1.setType("FOUND");
        item1.setCategory("Electronics");
        item1.setDescription("Found on table 4 in the 2nd-floor reading area. Kept securely at the library desk.");
        item1.setDate(LocalDate.now().minusDays(2));
        item1.setTime("03:30 PM");
        item1.setLocation("Central Library 2nd Floor");
        item1.setColor("Black");
        item1.setBrand("Boat");
        item1.setIdentifyingDetails("Slight scratch on the left earpiece button.");
        item1.setCurrentLocation("Library Main Reception Desk");
        item1.setContactInfo("librarian@campus.edu");
        item1.setImageUrl("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80");
        item1.setStatus("ACTIVE");
        item1.setUser(student2);
        item1.setCreatedAt(LocalDateTime.now().minusDays(2));
        item1.setUpdatedAt(LocalDateTime.now().minusDays(2));
        item1 = itemRepository.save(item1);

        // Item 2: Lost Boat Earphones (Matches with Item 1)
        Item item2 = new Item();
        item2.setItemName("Black Boat Earphones");
        item2.setType("LOST");
        item2.setCategory("Electronics");
        item2.setDescription("Lost during group study session near library window desks. Has sentimental value.");
        item2.setDate(LocalDate.now().minusDays(2));
        item2.setTime("03:00 PM");
        item2.setLocation("Central Library");
        item2.setColor("Black");
        item2.setBrand("Boat");
        item2.setIdentifyingDetails("Black neckband with silver logo.");
        item2.setContactInfo("+1-555-0142");
        item2.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80");
        item2.setStatus("ACTIVE");
        item2.setUser(student1);
        item2.setCreatedAt(LocalDateTime.now().minusDays(2));
        item2.setUpdatedAt(LocalDateTime.now().minusDays(2));
        itemRepository.save(item2);

        // Item 3: Found College ID Card
        Item item3 = new Item();
        item3.setItemName("Campus Student ID Card");
        item3.setType("FOUND");
        item3.setCategory("ID Cards");
        item3.setDescription("Student identity card found near cafeteria checkout counter.");
        item3.setDate(LocalDate.now().minusDays(1));
        item3.setTime("01:15 PM");
        item3.setLocation("Campus Cafeteria Food Court");
        item3.setColor("Blue");
        item3.setBrand("College Issued");
        item3.setIdentifyingDetails("Department of Mechanical Engineering, ID ending in 089.");
        item3.setCurrentLocation("Campus Security Post Gate 1");
        item3.setContactInfo("security@campus.edu");
        item3.setImageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80");
        item3.setStatus("ACTIVE");
        item3.setUser(student1);
        item3.setCreatedAt(LocalDateTime.now().minusDays(1));
        item3.setUpdatedAt(LocalDateTime.now().minusDays(1));
        itemRepository.save(item3);

        // Item 4: Found Casio Watch
        Item item4 = new Item();
        item4.setItemName("Casio Vintage Digital Watch");
        item4.setType("FOUND");
        item4.setCategory("Accessories");
        item4.setDescription("Found on the bench beside the outdoor basketball court after evening match.");
        item4.setDate(LocalDate.now().minusDays(3));
        item4.setTime("05:45 PM");
        item4.setLocation("Sports Complex Basketball Court");
        item4.setColor("Silver");
        item4.setBrand("Casio");
        item4.setIdentifyingDetails("Stainless steel band, minor scuff on top bezel.");
        item4.setCurrentLocation("Sports Department In-charge Room 102");
        item4.setContactInfo("+1-555-0189");
        item4.setImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80");
        item4.setStatus("ACTIVE");
        item4.setUser(student3);
        item4.setCreatedAt(LocalDateTime.now().minusDays(3));
        item4.setUpdatedAt(LocalDateTime.now().minusDays(3));
        item4 = itemRepository.save(item4);

        // Item 5: Lost HP Laptop Charger
        Item item5 = new Item();
        item5.setItemName("HP 65W Laptop Charger");
        item5.setType("LOST");
        item5.setCategory("Electronics");
        item5.setDescription("Left behind after CS lab practical session. Urgent needed for semester exam preparation.");
        item5.setDate(LocalDate.now().minusDays(4));
        item5.setTime("11:30 AM");
        item5.setLocation("Computer Lab 3 Block C");
        item5.setColor("Black");
        item5.setBrand("HP");
        item5.setIdentifyingDetails("Blue tip barrel connector with yellow sticker label.");
        item5.setContactInfo("+1-555-0118");
        item5.setImageUrl("https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80");
        item5.setStatus("ACTIVE");
        item5.setUser(student2);
        item5.setCreatedAt(LocalDateTime.now().minusDays(4));
        item5.setUpdatedAt(LocalDateTime.now().minusDays(4));
        itemRepository.save(item5);

        // Item 6: Found Blue Skybags Backpack
        Item item6 = new Item();
        item6.setItemName("Blue Skybags Laptop Backpack");
        item6.setType("FOUND");
        item6.setCategory("Bags");
        item6.setDescription("Found left on the back row seat after the guest lecture in Seminar Hall 2.");
        item6.setDate(LocalDate.now().minusDays(5));
        item6.setTime("04:00 PM");
        item6.setLocation("Seminar Hall 2 Admin Block");
        item6.setColor("Blue");
        item6.setBrand("Skybags");
        item6.setIdentifyingDetails("Has a NASA keychain attached to the front pocket zip.");
        item6.setCurrentLocation("Admin Office Enquiry Counter");
        item6.setContactInfo("admin@campus.edu");
        item6.setImageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80");
        item6.setStatus("RETURNED"); // One returned item for statistics
        item6.setUser(admin);
        item6.setCreatedAt(LocalDateTime.now().minusDays(5));
        item6.setUpdatedAt(LocalDateTime.now().minusDays(1));
        itemRepository.save(item6);

        // Item 7: Lost Chemistry Lab Record
        Item item7 = new Item();
        item7.setItemName("Chemistry Lab Record Notebook");
        item7.setType("LOST");
        item7.setCategory("Books");
        item7.setDescription("Spiral-bound chemistry lab record book with blue hard cover.");
        item7.setDate(LocalDate.now().minusDays(1));
        item7.setTime("02:00 PM");
        item7.setLocation("Chemistry Block Room 204");
        item7.setColor("Blue");
        item7.setBrand("College Stationery");
        item7.setIdentifyingDetails("Roll Number CS2024-042 written on the index page.");
        item7.setContactInfo("+1-555-0142");
        item7.setImageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80");
        item7.setStatus("ACTIVE");
        item7.setUser(student1);
        item7.setCreatedAt(LocalDateTime.now().minusDays(1));
        item7.setUpdatedAt(LocalDateTime.now().minusDays(1));
        itemRepository.save(item7);

        // Item 8: Found Fossil Wallet
        Item item8 = new Item();
        item8.setItemName("Brown Leather Fossil Wallet");
        item8.setType("FOUND");
        item8.setCategory("Accessories");
        item8.setDescription("Found under the bench in the campus garden pathway.");
        item8.setDate(LocalDate.now().minusDays(3));
        item8.setTime("12:45 PM");
        item8.setLocation("Campus Main Garden");
        item8.setColor("Brown");
        item8.setBrand("Fossil");
        item8.setIdentifyingDetails("Contains campus transit card and coins. Kept safely.");
        item8.setCurrentLocation("Student Affairs Office Room 12");
        item8.setContactInfo("affairs@campus.edu");
        item8.setImageUrl("https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80");
        item8.setStatus("ACTIVE");
        item8.setUser(student3);
        item8.setCreatedAt(LocalDateTime.now().minusDays(3));
        item8.setUpdatedAt(LocalDateTime.now().minusDays(3));
        itemRepository.save(item8);

        // 4. Create Sample Claim for Casio Watch
        Claim sampleClaim = new Claim();
        sampleClaim.setItem(item4);
        sampleClaim.setClaimant(student2);
        sampleClaim.setClaimantName("Priya Patel");
        sampleClaim.setClaimantStudentId("EE2023-018");
        sampleClaim.setClaimantPhone("+1-555-0118");
        sampleClaim.setReason("I lost my silver Casio vintage watch during practice on Tuesday evening.");
        sampleClaim.setAdditionalDetails("The watch display has a 24-hour mode enabled, and there is a small scratch near the top right button.");
        sampleClaim.setStatus("PENDING");
        sampleClaim.setCreatedAt(LocalDateTime.now().minusDays(1));
        sampleClaim.setUpdatedAt(LocalDateTime.now().minusDays(1));
        claimRepository.save(sampleClaim);

        System.out.println(">>> [DataInitializer] Sample data successfully initialized for Campus Lost & Found Portal!");
    }
}
