/// <reference types="jest" />
export declare const acquireLockMock: jest.Mock<any, any>;
export declare const releaseLockMock: jest.Mock<any, any>;
export default class FakeLock {
    acquireLock: jest.Mock<any, any>;
    releaseLock: jest.Mock<any, any>;
}
