import { safe, SafeError } from './src/ts-safe';

// Test for synchronous function
describe('safeSync', () => {
  it('should return success for a successful function', () => {
    const result = safe(() => 42);
    expect(result).toEqual({ success: true, data: 42 });
  });

  it('should return error for a function that throws', () => {
    const result = safe(() => {
      throw new Error('Test error');
    });
    expect(result).toEqual({ success: false, safeError: new Error('Test error') });
  });

  it('should return custom error for a function that throws', () => {
    const customError = new SafeError('Custom error');
    const result = safe(() => {
      throw new Error('Test error');
    }, customError);
    expect(result).toEqual({ success: false, safeError: customError });
  });
});

// Test for asynchronous function
describe('safeAsync', () => {
  it('should return success for a resolved promise', async () => {
    const result = await safe(Promise.resolve(42));
    expect(result).toEqual({ success: true, data: 42 });
  });

  it('should return error for a rejected promise', async () => {
    const result = await safe(Promise.reject(new Error('Test error')));
    expect(result).toEqual({ success: false, safeError: new Error('Test error') });
  });

  it('should return custom error for a rejected promise', async () => {
    const customError = new SafeError('Custom error');
    const result = await safe(Promise.reject(new Error('Test error')), customError);
    expect(result).toEqual({ success: false, safeError: customError });
  });
});
