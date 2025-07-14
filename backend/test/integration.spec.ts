import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Integration Tests', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Patients API', () => {
    it('/patients (GET)', () => {
      return request(app.getHttpServer()).get('/patients').expect(200);
    });

    it('/patients (POST)', () => {
      return request(app.getHttpServer())
        .post('/patients')
        .send({
          name: 'Test Patient',
          dateOfBirth: '1990-01-01',
        })
        .expect(201);
    });
  });

  describe('Medications API', () => {
    it('/medications (GET)', () => {
      return request(app.getHttpServer()).get('/medications').expect(200);
    });

    it('/medications (POST)', () => {
      return request(app.getHttpServer())
        .post('/medications')
        .send({
          name: 'Test Medication',
          dosage: '10mg',
          frequency: 'Once daily',
        })
        .expect(201);
    });
  });

  describe('Assignments API', () => {
    it('/assignments (GET)', () => {
      return request(app.getHttpServer()).get('/assignments').expect(200);
    });
  });
});
