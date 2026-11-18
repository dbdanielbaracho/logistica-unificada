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
