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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './game.model';
import { GameDto } from './game.dto';
import { validateMinPrice } from './validators/min-price.validator';

@UsePipes(new ValidationPipe())
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  getAllGames(): Game[] {
    return this.gameService.getAllGames();
  }

  @Post()
  createGame(@Body() game: GameDto): Game {
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
  updateGame(@Param('id') id: string, @Body() game: GameDto) {
    if (!validateMinPrice(game.price)) {
      throw new HttpException(
        'Price must be greater that 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.gameService.updateGame(id, game);
  }

  @Delete('/:id')
  deleteGame(@Param('id') id: string) {
    return this.gameService.deleteGame(id);
  }
}