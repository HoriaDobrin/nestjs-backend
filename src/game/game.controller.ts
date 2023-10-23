import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './game.model';
import { GameDto } from './game-dtos/game.dto';
import { validateMinPrice } from './validators/min-price.validator';
import { AuthGuard } from '@nestjs/passport';

@UsePipes(new ValidationPipe())
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  getAllGames(): Promise<Game[]> {
    return this.gameService.getAllGames();
  }

  @Get('/:id')
  getGameById(@Param('id') id: string): Promise<Game> {
    return this.gameService.getGameById(id);
  }

  @UseGuards(AuthGuard())
  @Get('export')
  exportGamesCSV() {
    return this.gameService.exportGamesAsCSV();
  }

  @UseGuards(AuthGuard())
  @Post('export-filtered')
  exportFilteredGamesCSV(@Body() games: GameDto[]) {
    return this.gameService.exportFilteredGamesAsCSV(games);
  }

  @Post()
  @UseGuards(AuthGuard())
  createGame(@Body() game: GameDto): Promise<Game> {
    if (typeof game.price === 'string') {
      game.price = parseInt(game.price, 10);
    }
    if (!validateMinPrice(game.price)) {
      throw new HttpException(
        'Price must be greater that 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.gameService.createGame(game);
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  updateGame(@Param('id') id: string, @Body() game: GameDto): Promise<Game> {
    if (!validateMinPrice(game.price)) {
      throw new HttpException(
        'Price must be greater that 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.gameService.updateGame(id, game);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteGame(@Param('id') id: string): Promise<void> {
    return this.gameService.deleteGame(id);
  }
}
