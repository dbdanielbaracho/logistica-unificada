import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PUBLIC_FREIGHT_RADII_KM,
  isDocumentedPublicFreightRadiusKm,
  parsePublicFreightRadiusKm,
  normalizePublicFreightDestination,
  normalizePublicFreightSearchFilters,
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


test('documented public radii remain immutable', () => {
  assert.equal(Object.isFrozen(PUBLIC_FREIGHT_RADII_KM), true);
  assert.throws(() => PUBLIC_FREIGHT_RADII_KM.push(500), TypeError);
  assert.deepEqual(PUBLIC_FREIGHT_RADII_KM, [50, 100, 200]);
});

test('public destination normalization trims Unicode whitespace without changing content', () => {
  assert.equal(normalizePublicFreightDestination('\u00a0Campinas - SP\u2003'), 'Campinas - SP');
  assert.equal(normalizePublicFreightDestination('\u00a0\u2003'), null);
  assert.equal(normalizePublicFreightDestination('São Paulo / SP'), 'São Paulo / SP');
});

test('public destination preserves meaningful interior whitespace and punctuation', () => {
  const destination = '  São Paulo  /  SP - Campinas, SP  ';
  assert.equal(normalizePublicFreightDestination(destination), 'São Paulo  /  SP - Campinas, SP');
  assert.equal(destination, '  São Paulo  /  SP - Campinas, SP  ');
});

test('public radius parsing does not coerce numeric-looking text or booleans', () => {
  for (const invalid of ['200', ' 50 ', true, false, 100n, new Number(50)]) {
    assert.throws(() => parsePublicFreightRadiusKm(invalid), RangeError);
  }
});


test('public filters reject boxed, symbolic and object inputs without implicit conversion', () => {
  const objectWithThrowingCoercion = {
    toString() { throw new Error('must not coerce input'); },
    valueOf() { throw new Error('must not coerce input'); },
  };
  for (const invalid of [Symbol('50'), new Number(100), objectWithThrowingCoercion]) {
    assert.throws(() => parsePublicFreightRadiusKm(invalid), RangeError);
  }
  for (const invalid of [Symbol('Campinas'), 100n, new String('Campinas'), objectWithThrowingCoercion]) {
    assert.throws(() => normalizePublicFreightDestination(invalid), TypeError);
  }
});

test('public freight filter composition preserves documented optional inputs', () => {
  assert.deepEqual(normalizePublicFreightSearchFilters(undefined, undefined), {
    radiusKm: null,
    destination: null,
  });
  assert.deepEqual(normalizePublicFreightSearchFilters(100, '  Campinas, SP  '), {
    radiusKm: 100,
    destination: 'Campinas, SP',
  });
  assert.deepEqual(normalizePublicFreightSearchFilters(null, '  São Paulo  /  SP  '), {
    radiusKm: null,
    destination: 'São Paulo  /  SP',
  });
});

test('public freight filter composition rejects invalid inputs and is immutable', () => {
  assert.throws(() => normalizePublicFreightSearchFilters('100', 'Campinas'), RangeError);
  assert.throws(() => normalizePublicFreightSearchFilters(50, { city: 'Campinas' }), TypeError);
  const filters = normalizePublicFreightSearchFilters(200, null);
  assert.equal(Object.isFrozen(filters), true);
  assert.throws(() => { filters.radiusKm = 50; }, TypeError);
  assert.deepEqual(filters, { radiusKm: 200, destination: null });
});

test('documented public radius guard is strict, total for input types, and consistent with parser', () => {
  for (const allowed of PUBLIC_FREIGHT_RADII_KM) {
    assert.equal(isDocumentedPublicFreightRadiusKm(allowed), true);
    assert.equal(parsePublicFreightRadiusKm(allowed), allowed);
  }
  const throwing = { valueOf() { throw new Error('unexpected coercion'); } };
  for (const invalid of [undefined, null, '', 0, 75, -1, NaN, Infinity, '50', true, 50n, Symbol('50'), throwing, new Number(50)]) {
    assert.equal(isDocumentedPublicFreightRadiusKm(invalid), false);
  }
});
