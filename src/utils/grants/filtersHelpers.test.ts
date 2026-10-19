import { describe, it, expect } from 'vitest';
import {
  buildGrantsFilters,
  hasActiveFilters,
  updateFilterParam,
  updatePageParam,
  toggleAIParam,
} from './filtersHelpers';

describe('grants/filtersHelpers', () => {
  describe('buildGrantsFilters', () => {
    it('builds filters with page and size', () => {
      const params = new URLSearchParams();
      const filters = buildGrantsFilters(params, 0, 12);

      expect(filters.page).toBe(0);
      expect(filters.size).toBe(12);
    });

    it('includes issuing body type from params', () => {
      const params = new URLSearchParams('issuingBodyType=CENTRAL');
      const filters = buildGrantsFilters(params, 0);

      expect(filters.issuingBodyType).toBe('CENTRAL');
    });

    it('includes type from params', () => {
      const params = new URLSearchParams('type=GRANT');
      const filters = buildGrantsFilters(params, 0);

      expect(filters.type).toBe('GRANT');
    });

    it('includes stageId from params', () => {
      const params = new URLSearchParams('stageId=stage-123');
      const filters = buildGrantsFilters(params, 0);

      expect(filters.stageId).toBe('stage-123');
    });

    it('includes sectorId from params', () => {
      const params = new URLSearchParams('sectorId=sector-456');
      const filters = buildGrantsFilters(params, 0);

      expect(filters.sectorId).toBe('sector-456');
    });

    it('includes amountBand from params', () => {
      const params = new URLSearchParams('amountBand=10L_50L');
      const filters = buildGrantsFilters(params, 0);

      expect(filters.amountBand).toBe('10L_50L');
    });

    it('includes deadline from params', () => {
      const params = new URLSearchParams('deadline=OPEN_NOW');
      const filters = buildGrantsFilters(params, 0);

      expect(filters.deadline).toBe('OPEN_NOW');
    });

    it('includes search query from params', () => {
      const params = new URLSearchParams('q=startup%20grant');
      const filters = buildGrantsFilters(params, 0);

      expect(filters.q).toBe('startup grant');
    });

    it('includes AI flag when true', () => {
      const params = new URLSearchParams('ai=true');
      const filters = buildGrantsFilters(params, 0);

      expect(filters.ai).toBe(true);
    });

    it('does not include AI flag when false or missing', () => {
      const params1 = new URLSearchParams('ai=false');
      const filters1 = buildGrantsFilters(params1, 0);
      expect(filters1.ai).toBeUndefined();

      const params2 = new URLSearchParams();
      const filters2 = buildGrantsFilters(params2, 0);
      expect(filters2.ai).toBeUndefined();
    });

    it('handles multiple filters', () => {
      const params = new URLSearchParams(
        'issuingBodyType=CENTRAL&type=GRANT&stageId=stage-1&q=test&ai=true'
      );
      const filters = buildGrantsFilters(params, 2, 20);

      expect(filters.page).toBe(2);
      expect(filters.size).toBe(20);
      expect(filters.issuingBodyType).toBe('CENTRAL');
      expect(filters.type).toBe('GRANT');
      expect(filters.stageId).toBe('stage-1');
      expect(filters.q).toBe('test');
      expect(filters.ai).toBe(true);
    });
  });

  describe('hasActiveFilters', () => {
    it('returns false for empty params', () => {
      const params = new URLSearchParams();
      expect(hasActiveFilters(params)).toBe(false);
    });

    it('returns true when issuing body type is set', () => {
      const params = new URLSearchParams('issuingBodyType=CENTRAL');
      expect(hasActiveFilters(params)).toBe(true);
    });

    it('returns true when type is set', () => {
      const params = new URLSearchParams('type=GRANT');
      expect(hasActiveFilters(params)).toBe(true);
    });

    it('returns true when stageId is set', () => {
      const params = new URLSearchParams('stageId=stage-1');
      expect(hasActiveFilters(params)).toBe(true);
    });

    it('returns true when sectorId is set', () => {
      const params = new URLSearchParams('sectorId=sector-1');
      expect(hasActiveFilters(params)).toBe(true);
    });

    it('returns true when amountBand is set', () => {
      const params = new URLSearchParams('amountBand=10L_50L');
      expect(hasActiveFilters(params)).toBe(true);
    });

    it('returns true when deadline is set', () => {
      const params = new URLSearchParams('deadline=OPEN_NOW');
      expect(hasActiveFilters(params)).toBe(true);
    });

    it('returns true when search query is set', () => {
      const params = new URLSearchParams('q=test');
      expect(hasActiveFilters(params)).toBe(true);
    });

    it('returns true when AI is enabled', () => {
      const params = new URLSearchParams('ai=true');
      expect(hasActiveFilters(params)).toBe(true);
    });

    it('returns false for non-filter params', () => {
      const params = new URLSearchParams('page=1&other=value');
      expect(hasActiveFilters(params)).toBe(false);
    });
  });

  describe('updateFilterParam', () => {
    it('sets a new filter param', () => {
      const params = new URLSearchParams();
      const result = updateFilterParam(params, 'type', 'GRANT');

      expect(result.get('type')).toBe('GRANT');
    });

    it('updates existing filter param', () => {
      const params = new URLSearchParams('type=SUBSIDY');
      const result = updateFilterParam(params, 'type', 'GRANT');

      expect(result.get('type')).toBe('GRANT');
    });

    it('removes filter param when value is empty', () => {
      const params = new URLSearchParams('type=GRANT');
      const result = updateFilterParam(params, 'type', '');

      expect(result.has('type')).toBe(false);
    });

    it('resets page when filter changes', () => {
      const params = new URLSearchParams('type=GRANT&page=5');
      const result = updateFilterParam(params, 'type', 'SUBSIDY');

      expect(result.get('type')).toBe('SUBSIDY');
      expect(result.has('page')).toBe(false);
    });

    it('preserves other params', () => {
      const params = new URLSearchParams('stageId=stage-1&sectorId=sector-1');
      const result = updateFilterParam(params, 'type', 'GRANT');

      expect(result.get('type')).toBe('GRANT');
      expect(result.get('stageId')).toBe('stage-1');
      expect(result.get('sectorId')).toBe('sector-1');
    });
  });

  describe('updatePageParam', () => {
    it('sets page param', () => {
      const params = new URLSearchParams();
      const result = updatePageParam(params, 5);

      expect(result.get('page')).toBe('5');
    });

    it('updates existing page param', () => {
      const params = new URLSearchParams('page=2');
      const result = updatePageParam(params, 10);

      expect(result.get('page')).toBe('10');
    });

    it('preserves other params', () => {
      const params = new URLSearchParams('type=GRANT&stageId=stage-1');
      const result = updatePageParam(params, 3);

      expect(result.get('page')).toBe('3');
      expect(result.get('type')).toBe('GRANT');
      expect(result.get('stageId')).toBe('stage-1');
    });
  });

  describe('toggleAIParam', () => {
    it('enables AI when not set', () => {
      const params = new URLSearchParams();
      const result = toggleAIParam(params);

      expect(result.get('ai')).toBe('true');
    });

    it('disables AI when enabled', () => {
      const params = new URLSearchParams('ai=true');
      const result = toggleAIParam(params);

      expect(result.has('ai')).toBe(false);
    });

    it('enables AI when explicitly false', () => {
      const params = new URLSearchParams('ai=false');
      const result = toggleAIParam(params);

      expect(result.get('ai')).toBe('true');
    });

    it('resets page when toggling AI', () => {
      const params = new URLSearchParams('page=5&ai=true');
      const result = toggleAIParam(params);

      expect(result.has('ai')).toBe(false);
      expect(result.has('page')).toBe(false);
    });

    it('preserves other params', () => {
      const params = new URLSearchParams('type=GRANT&stageId=stage-1');
      const result = toggleAIParam(params);

      expect(result.get('ai')).toBe('true');
      expect(result.get('type')).toBe('GRANT');
      expect(result.get('stageId')).toBe('stage-1');
    });
  });
});
