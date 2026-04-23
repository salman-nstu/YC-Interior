package com.yc.interior.service;

public interface DisplayOrderService {
    /**
     * Handles display order assignment and shifting
     * @param newOrder the requested display order
     * @param maxFeatured maximum allowed featured items (e.g., 4 for projects means 0-3)
     * @param currentCount current number of items
     * @return the actual display order to assign
     */
    Integer assignDisplayOrder(Integer newOrder, int maxFeatured, long currentCount);
    
    /**
     * Reorders items after deletion
     * @param deletedOrder the order of the deleted item
     * @param maxFeatured maximum allowed featured items
     */
    void reorderAfterDeletion(Integer deletedOrder, int maxFeatured);
}
