declare module 'supertest-session' {
  import { Application } from 'express';
  
  interface TestAgent {
    get(url: string): TestRequest;
    post(url: string): TestRequest;
    put(url: string): TestRequest;
    delete(url: string): TestRequest;
  }
  
  interface TestRequest {
    expect(status: number): TestRequest;
    send(data?: any): TestRequest;
    end(callback?: (err: any, res: any) => void): void;
  }
  
  function session(app: Application): TestAgent;
  
  export = session;
}