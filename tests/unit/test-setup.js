/* global jest */

global.fetch = jest.fn(url => Promise.resolve(url));
