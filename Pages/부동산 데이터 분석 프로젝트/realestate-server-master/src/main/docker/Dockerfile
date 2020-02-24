FROM openjdk:8-jdk-alpine
VOLUME /tmp
#ARG JAR_FILE
COPY *.jar realestate.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/realestate.jar"]
