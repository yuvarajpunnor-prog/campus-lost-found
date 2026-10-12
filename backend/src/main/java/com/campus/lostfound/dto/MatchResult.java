package com.campus.lostfound.dto;

import com.campus.lostfound.entity.Item;
import java.util.List;

public class MatchResult {

    private Item matchedItem;
    private int matchScore; // Percentage or score (0-100)
    private List<String> matchingReasons;

    public MatchResult() {
    }

    public MatchResult(Item matchedItem, int matchScore, List<String> matchingReasons) {
        this.matchedItem = matchedItem;
        this.matchScore = matchScore;
        this.matchingReasons = matchingReasons;
    }

    public Item getMatchedItem() {
        return matchedItem;
    }

    public void setMatchedItem(Item matchedItem) {
        this.matchedItem = matchedItem;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public List<String> getMatchingReasons() {
        return matchingReasons;
    }

    public void setMatchingReasons(List<String> matchingReasons) {
        this.matchingReasons = matchingReasons;
    }
}
