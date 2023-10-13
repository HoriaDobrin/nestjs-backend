import { Length } from 'class-validator';

export class GameDto {
  @Length(5)
  name?: string;
  genre?: string;
  // @Min(0)
  price?: number;
}
