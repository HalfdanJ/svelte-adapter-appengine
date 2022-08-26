import * as fs from 'node:fs';
import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration test', () => {
  it('runs the server', done => {
    chai.request('http://localhost:8080')
      .get('/todos')
      .end((error, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it('runs endpoints', done => {
    chai.request('http://localhost:8080')
      .get('/todos/__data.json')
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.type).to.equal('data');
        done();
      });
  });

  it('generates correct app.yaml', () => {
    const path = process.env.TEST_DIR;
    const yaml = fs.readFileSync(path + '/build/app.yaml').toString();

    expect(yaml).to.eq(fs.readFileSync('tests/expected_app.yaml').toString());
  });
});
