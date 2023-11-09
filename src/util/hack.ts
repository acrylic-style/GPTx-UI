/* eslint-disable */

// noinspection JSUnusedGlobalSymbols

interface ReadableStream<R = any> {
  [Symbol.asyncIterator](): AsyncIterableIterator<R>;
}

namespace MathJax {
  export function typeset(array: any[] = []): void {}
}
