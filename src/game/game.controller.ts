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
  getAllGames(): Game[] {
    return this.gameService.getAllGames();
  }

  @Post()
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
  deleteGame(@Param('id') id: string) {
    return this.gameService.deleteGame(id);
  }
}
