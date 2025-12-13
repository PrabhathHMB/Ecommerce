package com.example.backend.Product.Model;
import java.util.Date;  // Use java.util.Date
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String category;
    private Double price;
    private Double previousPrice;
    private Integer stock;
    private String description;
    private List<String> images;
    private Date createdAt;  
    private List<Variation> variations;
    private String sku;

    @Data
    public static class Variation {
        private String type;
        private List<Option> options;

        @Data
        public static class Option {
            private String value;
            private Integer stock;
        }
    }
}
