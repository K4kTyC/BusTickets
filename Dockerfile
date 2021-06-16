FROM amazoncorretto:11-alpine-jdk
RUN addgroup -S bustickets && adduser -S bustickets -G bustickets
USER bustickets:bustickets
COPY . /home/bustickets/build
RUN cd /home/bustickets/build && ./gradlew bootJar && mkdir ../app && cd ../
COPY ./build/build/libs/*.jar ./app
ENTRYPOINT ["java", "-jar", "/app/bustickets*.jar"]
