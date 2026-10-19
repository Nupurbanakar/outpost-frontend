import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStages } from './useStages';
import * as lookupsApi from '@/api/endpoints/lookups';
import type { Stage } from '@/types';

vi.mock('@/api/endpoints/lookups', () => ({
  lookupsApi: {
    getStages: vi.fn(),
  },
}));

describe('useStages', () => {
  const mockStages: Stage[] = [
    { id: '1', name: 'Ideation', order: 1 },
    { id: '2', name: 'Validation', order: 2 },
    { id: '3', name: 'Early Traction', order: 3 },
    { id: '4', name: 'Scaling', order: 4 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches stages on mount', async () => {
    vi.mocked(lookupsApi.lookupsApi.getStages).mockResolvedValueOnce(mockStages);

    const { result } = renderHook(() => useStages());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.stages).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stages).toEqual(mockStages);
    expect(result.current.error).toBe(null);
    expect(lookupsApi.lookupsApi.getStages).toHaveBeenCalledTimes(1);
  });

  it('sets error state when fetch fails', async () => {
    const mockError = new Error('Failed to fetch stages');
    vi.mocked(lookupsApi.lookupsApi.getStages).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useStages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stages).toEqual([]);
    expect(result.current.error).toEqual(mockError);
  });

  it('caches data and does not refetch unnecessarily', async () => {
    vi.mocked(lookupsApi.lookupsApi.getStages).mockResolvedValueOnce(mockStages);

    const { result, rerender } = renderHook(() => useStages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stages).toEqual(mockStages);
    expect(lookupsApi.lookupsApi.getStages).toHaveBeenCalledTimes(1);

    // Rerender should not trigger another fetch
    rerender();

    expect(lookupsApi.lookupsApi.getStages).toHaveBeenCalledTimes(1);
    expect(result.current.stages).toEqual(mockStages);
  });

  it('refetch clears cache and fetches again', async () => {
    const updatedStages: Stage[] = [
      { id: '1', name: 'Ideation', order: 1 },
      { id: '2', name: 'Validation', order: 2 },
      { id: '3', name: 'Growth', order: 3 },
    ];

    vi.mocked(lookupsApi.lookupsApi.getStages)
      .mockResolvedValueOnce(mockStages)
      .mockResolvedValueOnce(updatedStages);

    const { result } = renderHook(() => useStages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stages).toEqual(mockStages);
    expect(lookupsApi.lookupsApi.getStages).toHaveBeenCalledTimes(1);

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.stages).toEqual(updatedStages);
    });

    expect(lookupsApi.lookupsApi.getStages).toHaveBeenCalledTimes(2);
  });

  it('sets loading state during refetch', async () => {
    vi.mocked(lookupsApi.lookupsApi.getStages)
      .mockResolvedValueOnce(mockStages)
      .mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve(mockStages), 100))
      );

    const { result } = renderHook(() => useStages());

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
    vi.mocked(lookupsApi.lookupsApi.getStages)
      .mockResolvedValueOnce(mockStages)
      .mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useStages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stages).toEqual(mockStages);
    expect(result.current.error).toBe(null);

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    expect(result.current.stages).toEqual([]);
  });

  it('clears error state on successful refetch', async () => {
    const mockError = new Error('Initial fetch failed');
    vi.mocked(lookupsApi.lookupsApi.getStages)
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(mockStages);

    const { result } = renderHook(() => useStages());

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toBe(null);
    });

    expect(result.current.stages).toEqual(mockStages);
  });

  it('returns empty array initially', () => {
    vi.mocked(lookupsApi.lookupsApi.getStages).mockResolvedValueOnce(mockStages);

    const { result } = renderHook(() => useStages());

    expect(result.current.stages).toEqual([]);
  });

  it('maintains stages order from API', async () => {
    const unorderedStages: Stage[] = [
      { id: '3', name: 'Early Traction', order: 3 },
      { id: '1', name: 'Ideation', order: 1 },
      { id: '2', name: 'Validation', order: 2 },
    ];

    vi.mocked(lookupsApi.lookupsApi.getStages).mockResolvedValueOnce(unorderedStages);

    const { result } = renderHook(() => useStages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should maintain the order from API
    expect(result.current.stages).toEqual(unorderedStages);
  });

  it('handles empty stages array', async () => {
    vi.mocked(lookupsApi.lookupsApi.getStages).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useStages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stages).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('logs errors to console in development', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Failed to fetch');
    vi.mocked(lookupsApi.lookupsApi.getStages).mockRejectedValueOnce(mockError);

    renderHook(() => useStages());

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch stages:', mockError);
    });

    consoleErrorSpy.mockRestore();
  });
});
