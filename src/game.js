// card = 0..51: rank = card % 13 (0 = ace), suit = Math.floor(card / 13)
const cardValue = card => Math.min(card % 13 + 1, 10)

export function handScore(cards) {
  const hard = cards.reduce((sum, card) => sum + cardValue(card), 0)
  // only one ace can ever count as 11 without busting
  return cards.some(card => card % 13 === 0) && hard + 10 <= 21 ? hard + 10 : hard
}

export const isBlackjack = cards => cards.length === 2 && handScore(cards) === 21

export function drawCard(used) {
  let card
  do {
    card = Math.floor(Math.random() * 52)
  } while (used.includes(card))
  return card
}

// 'player' | 'dealer' | 'draw'
export function outcome(player, dealer) {
  const p = handScore(player)
  const d = handScore(dealer)
  if (p > 21) return 'dealer'
  if (d > 21) return 'player'
  if (isBlackjack(player) !== isBlackjack(dealer)) return isBlackjack(player) ? 'player' : 'dealer'
  if (p === d) return 'draw'
  return p > d ? 'player' : 'dealer'
}
