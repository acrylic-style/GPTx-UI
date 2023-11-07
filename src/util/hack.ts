/* eslint-disable */

// noinspection JSUnusedGlobalSymbols

interface ReadableStream<R = any> {
  [Symbol.asyncIterator](): AsyncIterableIterator<R>;
}
