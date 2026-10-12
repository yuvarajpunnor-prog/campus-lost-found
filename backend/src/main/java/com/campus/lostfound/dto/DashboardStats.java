package com.campus.lostfound.dto;

public class DashboardStats {

    private long totalUsers;
    private long totalLostItems;
    private long totalFoundItems;
    private long totalClaims;
    private long itemsReturned;
    private long activeReports;

    // User-specific metrics
    private long myLostItems;
    private long myFoundItems;
    private long myActiveClaims;
    private long myResolvedItems;

    public DashboardStats() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalLostItems() {
        return totalLostItems;
    }

    public void setTotalLostItems(long totalLostItems) {
        this.totalLostItems = totalLostItems;
    }

    public long getTotalFoundItems() {
        return totalFoundItems;
    }

    public void setTotalFoundItems(long totalFoundItems) {
        this.totalFoundItems = totalFoundItems;
    }

    public long getTotalClaims() {
        return totalClaims;
    }

    public void setTotalClaims(long totalClaims) {
        this.totalClaims = totalClaims;
    }

    public long getItemsReturned() {
        return itemsReturned;
    }

    public void setItemsReturned(long itemsReturned) {
        this.itemsReturned = itemsReturned;
    }

    public long getActiveReports() {
        return activeReports;
    }

    public void setActiveReports(long activeReports) {
        this.activeReports = activeReports;
    }

    public long getMyLostItems() {
        return myLostItems;
    }

    public void setMyLostItems(long myLostItems) {
        this.myLostItems = myLostItems;
    }

    public long getMyFoundItems() {
        return myFoundItems;
    }

    public void setMyFoundItems(long myFoundItems) {
        this.myFoundItems = myFoundItems;
    }

    public long getMyActiveClaims() {
        return myActiveClaims;
    }

    public void setMyActiveClaims(long myActiveClaims) {
        this.myActiveClaims = myActiveClaims;
    }

    public long getMyResolvedItems() {
        return myResolvedItems;
    }

    public void setMyResolvedItems(long myResolvedItems) {
        this.myResolvedItems = myResolvedItems;
    }
}
