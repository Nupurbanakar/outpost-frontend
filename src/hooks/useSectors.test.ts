import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSectors } from './useSectors';
import * as lookupsApi from '@/api/endpoints/lookups';
import type { Sector } from '@/types';

vi.mock('@/api/endpoints/lookups', () => ({
  lookupsApi: {
    getSectors: vi.fn(),
  },
}));

describe('useSectors', () => {
  const mockSectors: Sector[] = [
    { id: '1', name: 'FinTech' },
    { id: '2', name: 'HealthTech' },
    { id: '3', name: 'EdTech' },
    { id: '4', name: 'AgriTech' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches sectors on mount', async () => {
    vi.mocked(lookupsApi.lookupsApi.getSectors).mockResolvedValueOnce(mockSectors);

    const { result } = renderHook(() => useSectors());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.sectors).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sectors).toEqual(mockSectors);
    expect(result.current.error).toBe(null);
    expect(lookupsApi.lookupsApi.getSectors).toHaveBeenCalledTimes(1);
  });

  it('sets error state when fetch fails', async () => {
    const mockError = new Error('Failed to fetch sectors');
    vi.mocked(lookupsApi.lookupsApi.getSectors).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSectors());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sectors).toEqual([]);
    expect(result.current.error).toEqual(mockError);
  });

  it('caches data and does not refetch unnecessarily', async () => {
    vi.mocked(lookupsApi.lookupsApi.getSectors).mockResolvedValueOnce(mockSectors);

    const { result, rerender } = renderHook(() => useSectors());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sectors).toEqual(mockSectors);
    expect(lookupsApi.lookupsApi.getSectors).toHaveBeenCalledTimes(1);

    // Rerender should not trigger another fetch
    rerender();

    expect(lookupsApi.lookupsApi.getSectors).toHaveBeenCalledTimes(1);
    expect(result.current.sectors).toEqual(mockSectors);
  });

  it('refetch clears cache and fetches again', async () => {
    const updatedSectors: Sector[] = [
      { id: '1', name: 'FinTech' },
      { id: '2', name: 'HealthTech' },
      { id: '3', name: 'CleanTech' },
    ];

    vi.mocked(lookupsApi.lookupsApi.getSectors)
      .mockResolvedValueOnce(mockSectors)
      .mockResolvedValueOnce(updatedSectors);

    const { result } = renderHook(() => useSectors());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sectors).toEqual(mockSectors);
    expect(lookupsApi.lookupsApi.getSectors).toHaveBeenCalledTimes(1);

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.sectors).toEqual(updatedSectors);
    });

    expect(lookupsApi.lookupsApi.getSectors).toHaveBeenCalledTimes(2);
  });

  it('sets loading state during refetch', async () => {
    vi.mocked(lookupsApi.lookupsApi.getSectors)
      .mockResolvedValueOnce(mockSectors)
      .mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve(mockSectors), 100))
      );

    const { result } = renderHook(() => useSectors());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Trigger refetch
    const refetchPromise = result.current.refetch();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await refetchPromise;

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('handles errors during refetch', async () => {
    const mockError = new Error('Refetch failed');
    vi.mocked(lookupsApi.lookupsApi.getSectors)
      .mockResolvedValueOnce(mockSectors)
      .mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSectors());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sectors).toEqual(mockSectors);
    expect(result.current.error).toBe(null);

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    expect(result.current.sectors).toEqual([]);
  });

  it('clears error state on successful refetch', async () => {
    const mockError = new Error('Initial fetch failed');
    vi.mocked(lookupsApi.lookupsApi.getSectors)
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(mockSectors);

    const { result } = renderHook(() => useSectors());

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toBe(null);
    });

    expect(result.current.sectors).toEqual(mockSectors);
  });

  it('returns empty array initially', () => {
    vi.mocked(lookupsApi.lookupsApi.getSectors).mockResolvedValueOnce(mockSectors);

    const { result } = renderHook(() => useSectors());

    expect(result.current.sectors).toEqual([]);
  });

  it('maintains sectors order from API', async () => {
    const unorderedSectors: Sector[] = [
      { id: '3', name: 'EdTech' },
      { id: '1', name: 'FinTech' },
      { id: '2', name: 'HealthTech' },
    ];

    vi.mocked(lookupsApi.lookupsApi.getSectors).mockResolvedValueOnce(unorderedSectors);

    const { result } = renderHook(() => useSectors());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should maintain the order from API
    expect(result.current.sectors).toEqual(unorderedSectors);
  });

  it('handles empty sectors array', async () => {
    vi.mocked(lookupsApi.lookupsApi.getSectors).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useSectors());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sectors).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('logs errors to console in development', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Failed to fetch');
    vi.mocked(lookupsApi.lookupsApi.getSectors).mockRejectedValueOnce(mockError);

    renderHook(() => useSectors());

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch sectors:', mockError);
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles network errors', async () => {
    const networkError = new Error('Network Error');
    networkError.name = 'NetworkError';
    vi.mocked(lookupsApi.lookupsApi.getSectors).mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useSectors());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(networkError);
    expect(result.current.sectors).toEqual([]);
  });

  it('handles timeout errors', async () => {
    const timeoutError = new Error('Request timeout');
    timeoutError.name = 'TimeoutError';
    vi.mocked(lookupsApi.lookupsApi.getSectors).mockRejectedValueOnce(timeoutError);

    const { result } = renderHook(() => useSectors());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(timeoutError);
    expect(result.current.sectors).toEqual([]);
  });
});
