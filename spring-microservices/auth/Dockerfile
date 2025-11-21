# --- Stage 1: Compilar con Maven ---
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar archivos del proyecto
COPY pom.xml .
COPY src ./src

# Compilar sin tests para acelerar
RUN mvn -B -DskipTests clean package

# --- Stage 2: Runtime ---
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copiar JAR empaquetado
COPY --from=build /app/target/*.jar app.jar

# Perfil Docker
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS=""

# Exponer puerto del servicio Auth (comúnmente 8084)
EXPOSE 8084

# Iniciar microservicio
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
