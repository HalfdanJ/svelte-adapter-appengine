import * as fs from 'node:fs';
import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

const expect = chai.expect;

chai.use(chaiHttp);

// Import app from '/var/folders/16/f8v5hfg122d0h_rg7sb51pgr00c3w8/T/svelte-adapter-appengine.Ji2ciF2F/.appengine_build_output/index.js';

// console.log(app);
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
      .get('/todos.json')
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.deep.equal([]);
        done();
      });
  });

  it('generates correct app.yaml', () => {
    const path = process.env.TEST_DIR;
    const yaml = fs.readFileSync(path + '/.appengine_build_output/app.yaml').toString();

    expect(yaml).to.eq(fs.readFileSync('tests/expected_app.yaml').toString());
  });
});
