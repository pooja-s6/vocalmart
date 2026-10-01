package com.vocalmart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VocalmartApplication {

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(VocalmartApplication.class);
        application.addInitializers(context -> {
            String password = context.getEnvironment().getProperty("spring.datasource.password", "");
            if (password.isBlank()) {
                throw new IllegalStateException(
                        "DB_PASSWORD is not set. Set DB_PASSWORD to the password for PostgreSQL user postgres (database vocalmart) before starting the backend.");
            }
        });
        application.run(args);
    }
}
