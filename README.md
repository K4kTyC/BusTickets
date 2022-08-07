# BusTickets


## Setup

1. Install docker
2. Set environment variables
3. Run docker **db** service from _./docker/compose.yml_ file

## Environment variables

* BUSTICKETS_DATASOURCE_URL (_jdbc:mariadb://localhost:3306/db_)
* BUSTICKETS_DATASOURCE_USERNAME
* BUSTICKETS_DATASOURCE_PASSWORD
* BUSTICKETS_DATASOURCE_VOLUME (volume path for database in docker container)
