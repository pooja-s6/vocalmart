package com.vocalmart.repository;

import com.vocalmart.entity.Product;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.category c
            WHERE (:query IS NULL OR (
                    LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))
                    OR LOWER(p.description) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))))
              AND (:categoryId IS NULL OR c.id = :categoryId)
              AND (:minPrice IS NULL OR p.price >= :minPrice)
              AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            """)
    List<Product> search(
            @Param("query") String query,
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice);

    long countByCategory_Id(Long categoryId);
}
