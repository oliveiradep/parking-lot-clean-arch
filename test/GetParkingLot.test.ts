const request = require('supertest');
const express = require('../src/infra/http/express');
const hapi = require('../src/infra/http/hapi');

describe('Express', function () {
    it('Get parking lot', async() => {
        const response = function(res) {
            expect(res.body).toStrictEqual({"capacity": 2, "closeHour": 22, "code": "gym", "occupiedSpaces": 0, "openHour": 6});
        };

        await request(express)
            .get('/parking-lots/gym')
            .expect(200)
            .expect(response);
    });

    it('Route not found', async() => {
        const response = function(res) {
            expect(res.body).toStrictEqual({});
        };

        await request(express)
            .get('/parking-lots')
            .expect(404)
            .expect(response);
    });
});

describe('Hapi', function () {
    it('Get parking lot', async () => {
        const response = function(res) {
            expect(res.body).toStrictEqual({"capacity": 2, "closeHour": 22, "code": "gym", "occupiedSpaces": 0, "openHour": 6});
        };

        await request(hapi.listener)
            .get('/parking-lots/gym')
            .expect(200)
            .expect(response);
    });

    it('Route not found', async () => {
        const response = function(res) {
            expect(res.body).toStrictEqual({"statusCode":404,"error":"Not Found","message":"Not Found"});
        };

        await request(hapi.listener)
            .get('/parking-lots')
            .expect(404)
            .expect(response);
    });
});