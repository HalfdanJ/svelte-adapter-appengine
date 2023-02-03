import * as fs from 'node:fs';
import process from 'node:process';
import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration test', () => {
  it('runs the server', done => {
    chai.request('http://localhost:8080')
      .get('/sverdle')
      .end((error, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it('return 200 OK from /_ah/start scaling route', done => {
    chai.request('http://localhost:8080')
      .get('/_ah/start')
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.text).to.equal('OK');
        done();
      });
  });

  it('return 200 OK from /test.json prerendered route', done => {
    chai.request('http://localhost:8080')
      .get('/test.json')
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.text).to.equal('{"test":true}');
        done();
      });
  });

  it('generates correct app.yaml', () => {
    const path = process.env.TEST_DIR;
    const yaml = fs.readFileSync(path + '/build/app.yaml').toString();

    expect(yaml).to.eq(fs.readFileSync('tests/expected_app.yaml').toString());
  });

  it('generates correct package.json', () => {
    const path = process.env.TEST_DIR;
    const packageJson = fs.readFileSync(path + '/build/package.json').toString();

    expect(packageJson).to.eq(fs.readFileSync('tests/expected_package.json').toString());
  });
});
