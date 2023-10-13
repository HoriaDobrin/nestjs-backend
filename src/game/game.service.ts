import { Injectable, NotFoundException } from '@nestjs/common';
import { Game } from './game.model';
import { GameDto } from './game.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GameService {
  private games: Game[] = [];

  getAllGames() {
    return this.games;
  }

  getGameById(id: string) {
    return this.games.find((game) => game.id === id);
  }

  createGame(game: GameDto): Game {
    const newGame: Game = {
      id: uuid(),
      name: game.name,
      genre: game.genre,
      price: game.price,
    };

    this.games.push(newGame);

    return newGame;
  }

  updateGame(id, game: GameDto): Game {
    const { name, genre, price } = game;
    const updateGame = this.getGameById(id);

    if (updateGame) {
      if (name !== undefined) {
        updateGame.name = name;
      }
      if (genre !== undefined) {
        updateGame.genre = genre;
      }
      if (price !== undefined) {
        updateGame.price = price;
      }
      return updateGame as Game;
    } else {
      throw new NotFoundException('Id not found');
    }
  }

  deleteGame(id: string) {
    const deleteGameIndex = this.games.findIndex((game) => game.id === id);

    if (deleteGameIndex != -1) {
      this.games.splice(deleteGameIndex, 1);
    } else {
      throw new NotFoundException('Id not found');
    }
  }
}
