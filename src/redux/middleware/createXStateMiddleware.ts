import { Middleware } from '@reduxjs/toolkit';
import { XStateSlice } from '../customSlice/createXStateSlice';

/**
 * Creates a middleware which can interface between
 * XState and Redux
 */
export const createXStateMiddleware = (...slices: XStateSlice[]): Middleware =>
  function exampleMiddleware(storeAPI) {
    const services = slices.map(slice => slice._start(storeAPI));

    return function wrapDispatch(next) {
      return function handleAction(action) {
        const nextResult = next(action);
        services.forEach(service => {
          service.send(action);
        });
        return nextResult;
      };
    };
  };
