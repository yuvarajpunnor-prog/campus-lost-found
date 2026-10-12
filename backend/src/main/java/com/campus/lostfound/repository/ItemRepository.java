package com.campus.lostfound.repository;

import com.campus.lostfound.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Item> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, String type);

    List<Item> findByTypeOrderByCreatedAtDesc(String type);

    List<Item> findTop6ByTypeAndStatusOrderByCreatedAtDesc(String type, String status);

    long countByType(String type);

    long countByStatus(String status);

    long countByUserIdAndType(Long userId, String type);

    long countByUserIdAndStatus(Long userId, String status);

    @Query("SELECT i FROM Item i WHERE " +
           "(:type IS NULL OR i.type = :type) AND " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:location IS NULL OR LOWER(i.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:keyword IS NULL OR " +
           " LOWER(i.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(i.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(i.color) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(i.location) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
           ") ORDER BY i.createdAt DESC")
    List<Item> searchItems(
            @Param("type") String type,
            @Param("category") String category,
            @Param("status") String status,
            @Param("location") String location,
            @Param("keyword") String keyword
    );

    // Find candidates for matching (e.g. opposite type)
    List<Item> findByTypeAndStatusNot(String type, String status);
}
