import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update value before delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } },
    );

    rerender({ value: 'world', delay: 300 });

    // Advance less than delay
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('hello');
  });

  it('updates value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } },
    );

    rerender({ value: 'world', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('world');
  });

  it('resets the timer on rapid changes and only returns the final value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } },
    );

    rerender({ value: 'ab', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'abc', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'abcd', delay: 500 });

    // None of the intermediate values should have resolved yet
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Only the final value appears
    expect(result.current).toBe('abcd');
  });

  it('works with non-string types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 42, delay: 100 } },
    );

    rerender({ value: 99, delay: 100 });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe(99);
  });
});
