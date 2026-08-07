const activeGames = {};

export function createGame(gameId, game) {
  activeGames[gameId] = game;
}

export function getGame(gameId) {
  return activeGames[gameId];
}

export function deleteGame(gameId) {
  delete activeGames[gameId];
}
