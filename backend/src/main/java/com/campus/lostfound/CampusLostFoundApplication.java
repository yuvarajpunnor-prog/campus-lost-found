package com.campus.lostfound;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusLostFoundApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusLostFoundApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  CAMPUS LOST & FOUND PORTAL IS RUNNING SUCCESSFULLY!            ");
        System.out.println("  Access the Portal at: http://localhost:8080                    ");
        System.out.println("  Admin Login: admin@campus.edu / admin123                       ");
        System.out.println("  Student Login: rahul@campus.edu / password123                  ");
        System.out.println("==================================================================");
    }
}
