# Stage 1: BUILD
# Use Maven + Java 17 to build the jar
FROM maven:3.9.4-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first — Docker caches dependencies layer
# If pom.xml hasn't changed, Docker skips downloading dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: RUN
# Use lightweight Java 17 runtime only — no Maven needed
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy only the built jar from stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run with prod profile activated
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]