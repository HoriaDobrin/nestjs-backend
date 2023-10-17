import { Injectable, NotFoundException } from '@nestjs/common';
import { Game } from './game.model';
import { GameDto } from './game-dtos/game.dto';
import { v4 as uuid } from 'uuid';
import { readDataFromFile, writeDataToFile } from 'src/data/readWriteData';
import { createObjectCsvWriter } from 'csv-writer';

@Injectable()
export class GameService {
  private games: Game[] = [];

  async getAllGames(): Promise<Game[]> {
    const data = await readDataFromFile<Game>('games');

    return data;
  }

  async exportGamesAsCSV(): Promise<void> {
    const games = await this.getAllGames(); // Obțineți lista de jocuri

    const csvWriter = createObjectCsvWriter({
      path: 'C:/Users/Horiacus/Desktop/Intern Project/InternshipProject-Backend/nestjs-backend/src/data/games.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Nume' },
        { id: 'genre', title: 'Gen' },
        { id: 'price', title: 'Preț' },
      ],
    });

    await csvWriter.writeRecords(games);
    // Întoarceți un răspuns sau faceți altă manipulare, de exemplu, returnați calea fișierului CSV creat
  }

  async getGameById(id: string): Promise<Game> {
    const data = await readDataFromFile<Game>('games');

    const found = data.find((game) => game.id === id);

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async createGame(game: GameDto): Promise<Game> {
    const newGame: Game = {
      id: uuid(),
      name: game.name,
      genre: game.genre,
      price: game.price,
    };

    const data = await readDataFromFile<Game>('games');

    await data.push(newGame);

    writeDataToFile('games', data);

    return newGame;
  }

  async updateGame(id, game: GameDto): Promise<Game> {
    const { name, genre, price } = game;

    const data = await readDataFromFile<Game>('games');
    const index = data.findIndex((game) => game.id === id);

    const updateGame = data[index];

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

      data[index] = updateGame;

      writeDataToFile('games', data);

      return updateGame as Game;
    } else {
      throw new NotFoundException('Id not found');
    }
  }

  async deleteGame(id: string): Promise<void> {
    const data = await readDataFromFile<Game>('games');
    const deleteGameIndex = data.findIndex((game) => game.id === id);

    if (deleteGameIndex != -1) {
      data.splice(deleteGameIndex, 1);
      writeDataToFile('games', data);
    } else {
      throw new NotFoundException('Id not found');
    }
  }
}
