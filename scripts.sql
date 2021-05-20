CREATE DATABASE parking_lot;
USE parking_lot;

CREATE TABLE parked_car (
                            code varchar(255),
                            plate varchar(255),
                            date datetime
);

CREATE TABLE parking_lot (
                             code varchar(255),
                             capacity int,
                             open_hour int,
                             close_hour int
);

INSERT INTO parking_lot (code, capacity, open_hour, close_hour) VALUES ('gym', 2, 6, 22);