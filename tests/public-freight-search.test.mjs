import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PUBLIC_FREIGHT_RADII_KM,
  parsePublicFreightRadiusKm,
  normalizePublicFreightDestination,
} from '../src/lib/public-freight-search.mjs';

test('public freight search accepts only documented 50/100/200 km radii', () => {
  assert.deepEqual(PUBLIC_FREIGHT_RADII_KM, [50, 100, 200]);
  for (const radius of PUBLIC_FREIGHT_RADII_KM) {
    assert.equal(parsePublicFreightRadiusKm(radius), radius);
  }
  for (const invalid of [0, 1, 49, 75, 201, -50, NaN, Infinity, '50', '100', {}, []]) {
    assert.throws(() => parsePublicFreightRadiusKm(invalid), RangeError);
  }
});

test('public freight radius is optional and does not silently choose a radius', () => {
  for (const absent of [undefined, null, '']) {
    assert.equal(parsePublicFreightRadiusKm(absent), null);
  }
});

test('destination is optional only in public freight search', () => {
  for (const absent of [undefined, null, '', '   ']) {
    assert.equal(normalizePublicFreightDestination(absent), null);
  }
  assert.equal(normalizePublicFreightDestination('  Campinas, SP  '), 'Campinas, SP');
  for (const invalid of [0, 50, false, {}, []]) {
    assert.throws(() => normalizePublicFreightDestination(invalid), TypeError);
  }
});
