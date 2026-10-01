package com.example.productapi;

import com.example.productapi.model.Product;
import com.example.productapi.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class ProductapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductapiApplication.class, args);
	}

	@Bean
	CommandLineRunner seedProducts(ProductRepository productRepository) {
		return args -> {
			if (productRepository.count() > 0) {
				return;
			}

			List<Product> products = List.of(
					Product.builder().name("Wireless Headphones").price(2999.0).description("Bluetooth headphones with deep bass and 20-hour battery.").category("Electronics").imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80").stock(25).build(),
					Product.builder().name("Smart Watch").price(4999.0).description("Track fitness, calls, and notifications in one place.").category("Electronics").imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80").stock(18).build(),
					Product.builder().name("USB-C Laptop Stand").price(1299.0).description("Adjustable stand for students working on laptops.").category("Electronics").imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80").stock(40).build(),
					Product.builder().name("Portable Bluetooth Speaker").price(2199.0).description("Compact speaker with loud sound for study breaks.").category("Electronics").imageUrl("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80").stock(22).build(),
					Product.builder().name("LED Desk Lamp").price(899.0).description("Bright desk lamp for night study sessions.").category("Electronics").imageUrl("https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80").stock(35).build(),
					Product.builder().name("Basmati Rice 5kg").price(649.0).description("Long grain rice for everyday meals.").category("Grocery").imageUrl("https://images.unsplash.com/photo-1512504773348-f93d2a4f3f0f?auto=format&fit=crop&w=800&q=80").stock(50).build(),
					Product.builder().name("Organic Milk Pack").price(60.0).description("Fresh milk for breakfast and tea.").category("Grocery").imageUrl("https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80").stock(60).build(),
					Product.builder().name("Crunchy Oats").price(180.0).description("Healthy oats for a quick student breakfast.").category("Grocery").imageUrl("https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80").stock(45).build(),
					Product.builder().name("Dark Chocolate Pack").price(120.0).description("Sweet snack for late-night coding sessions.").category("Grocery").imageUrl("https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80").stock(70).build(),
					Product.builder().name("Instant Noodles Combo").price(199.0).description("Quick meal option for busy days.").category("Grocery").imageUrl("https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80").stock(80).build(),
					Product.builder().name("Casual Cotton T-Shirt").price(499.0).description("Soft everyday t-shirt for college wear.").category("Clothing").imageUrl("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80").stock(30).build(),
					Product.builder().name("Denim Jeans").price(1499.0).description("Regular fit jeans with a clean look.").category("Clothing").imageUrl("https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80").stock(20).build(),
					Product.builder().name("Hoodie Sweatshirt").price(1699.0).description("Warm hoodie for cool evenings.").category("Clothing").imageUrl("https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80").stock(15).build(),
					Product.builder().name("Sneakers").price(2299.0).description("Comfortable shoes for daily use.").category("Clothing").imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80").stock(16).build(),
					Product.builder().name("Cotton Socks Pack").price(299.0).description("Pack of soft socks for regular use.").category("Clothing").imageUrl("https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80").stock(55).build(),
					Product.builder().name("Non-Stick Fry Pan").price(799.0).description("Easy-to-clean fry pan for home cooking.").category("Kitchen").imageUrl("https://images.unsplash.com/photo-1584990347449-a867b6bd1a40?auto=format&fit=crop&w=800&q=80").stock(28).build(),
					Product.builder().name("Stainless Steel Water Bottle").price(549.0).description("Reusable bottle for class and gym.").category("Kitchen").imageUrl("https://images.unsplash.com/photo-1526401485004-2aa7b7b0c0e6?auto=format&fit=crop&w=800&q=80").stock(42).build(),
					Product.builder().name("Lunch Box Set").price(699.0).description("Leak-proof lunch boxes for college.").category("Kitchen").imageUrl("https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80").stock(24).build(),
					Product.builder().name("Electric Kettle").price(1199.0).description("Fast boiling kettle for tea and coffee.").category("Kitchen").imageUrl("https://images.unsplash.com/photo-1517089596392-fb9a0f4fca7d?auto=format&fit=crop&w=800&q=80").stock(19).build(),
					Product.builder().name("Food Storage Containers").price(459.0).description("Set of containers to keep food fresh.").category("Kitchen").imageUrl("https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=800&q=80").stock(33).build()
			);

			productRepository.saveAll(products);
		};
	}

}
