import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handScore, isBlackjack, outcome } from './game.js'

// ace = 0, 2 = 1, 5 = 4, 9 = 8, 10 = 9, K = 12 (hearts); +13 per suit
test('aces count as 11 only when it does not bust', () => {
  assert.equal(handScore([0, 13]), 12)
  assert.equal(handScore([0, 13, 8]), 21)
  assert.equal(handScore([0, 12]), 21)
  assert.equal(handScore([0, 12, 25]), 21)
  assert.equal(handScore([12, 25, 4]), 25)
})

test('blackjack is a two-card 21 only', () => {
  assert.ok(isBlackjack([0, 12]))
  assert.ok(!isBlackjack([9, 8, 13]))
})

test('outcome', () => {
  assert.equal(outcome([12, 25, 4], [12, 25, 38]), 'dealer') // player bust loses first
  assert.equal(outcome([12, 25], [12, 9, 30]), 'player') // dealer bust
  assert.equal(outcome([0, 12], [22, 21, 27]), 'player') // natural beats 3-card 21
  assert.equal(outcome([9, 8, 14], [22, 21, 27]), 'draw') // 21 vs 21, no naturals
  assert.equal(outcome([12, 25], [12, 21]), 'player')
})
