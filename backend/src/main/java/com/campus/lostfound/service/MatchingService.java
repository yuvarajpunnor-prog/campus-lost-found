package com.campus.lostfound.service;

import com.campus.lostfound.dto.MatchResult;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Service that implements the campus lost & found matching algorithm.
 * Simple, explainable logic for college viva presentation.
 */
@Service
public class MatchingService {

    @Autowired
    private ItemRepository itemRepository;

    public List<MatchResult> findMatches(Item targetItem) {
        String oppositeType = "LOST".equalsIgnoreCase(targetItem.getType()) ? "FOUND" : "LOST";
        List<Item> candidates = itemRepository.findByTypeAndStatusNot(oppositeType, "CLOSED");

        List<MatchResult> matches = new ArrayList<>();

        for (Item candidate : candidates) {
            int score = 0;
            List<String> reasons = new ArrayList<>();

            // 1. Category Check (+35 pts)
            if (targetItem.getCategory() != null && candidate.getCategory() != null &&
                    targetItem.getCategory().equalsIgnoreCase(candidate.getCategory())) {
                score += 35;
                reasons.add("Same Category (" + candidate.getCategory() + ")");
            }

            // 2. Item Name Keywords (+25 pts)
            if (targetItem.getItemName() != null && candidate.getItemName() != null) {
                String nameA = targetItem.getItemName().toLowerCase();
                String nameB = candidate.getItemName().toLowerCase();

                if (nameA.contains(nameB) || nameB.contains(nameA)) {
                    score += 25;
                    reasons.add("Item name matches closely");
                } else {
                    String[] wordsA = nameA.split("\\s+");
                    boolean wordMatched = false;
                    for (String w : wordsA) {
                        if (w.length() > 2 && nameB.contains(w)) {
                            wordMatched = true;
                            break;
                        }
                    }
                    if (wordMatched) {
                        score += 15;
                        reasons.add("Item keywords match");
                    }
                }
            }

            // 3. Location Check (+20 pts)
            if (targetItem.getLocation() != null && candidate.getLocation() != null) {
                String locA = targetItem.getLocation().toLowerCase();
                String locB = candidate.getLocation().toLowerCase();
                if (locA.contains(locB) || locB.contains(locA)) {
                    score += 20;
                    reasons.add("Reported at similar location (" + candidate.getLocation() + ")");
                }
            }

            // 4. Color Check (+10 pts)
            if (targetItem.getColor() != null && candidate.getColor() != null &&
                    !targetItem.getColor().isBlank() && !candidate.getColor().isBlank()) {
                if (targetItem.getColor().equalsIgnoreCase(candidate.getColor()) ||
                        candidate.getColor().toLowerCase().contains(targetItem.getColor().toLowerCase()) ||
                        targetItem.getColor().toLowerCase().contains(candidate.getColor().toLowerCase())) {
                    score += 10;
                    reasons.add("Matching color: " + candidate.getColor());
                }
            }

            // 5. Brand Check (+10 pts)
            if (targetItem.getBrand() != null && candidate.getBrand() != null &&
                    !targetItem.getBrand().isBlank() && !candidate.getBrand().isBlank()) {
                if (targetItem.getBrand().equalsIgnoreCase(candidate.getBrand())) {
                    score += 10;
                    reasons.add("Same brand: " + candidate.getBrand());
                }
            }

            // 6. Date Proximity Check (+10 pts if within 3 days)
            if (targetItem.getDate() != null && candidate.getDate() != null) {
                long daysDiff = Math.abs(ChronoUnit.DAYS.between(targetItem.getDate(), candidate.getDate()));
                if (daysDiff <= 3) {
                    score += 10;
                    reasons.add("Reported within " + daysDiff + " day(s)");
                }
            }

            // Threshold: score >= 40 is a potential match
            if (score >= 40) {
                matches.add(new MatchResult(candidate, Math.min(score, 100), reasons));
            }
        }

        // Sort descending by match score
        matches.sort(Comparator.comparingInt(MatchResult::getMatchScore).reversed());

        return matches;
    }
}
