FROM openjdk:17-jdk-slim
VOLUME /tmp
WORKDIR /app
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 8081
