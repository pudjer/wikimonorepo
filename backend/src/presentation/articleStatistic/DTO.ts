import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Order, OrderingProp } from '../../domain/articleStatistic/entity';


export class GetByIdsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
export class OrderDto{
  @ApiProperty({ enum: Order })
  @IsEnum(Order)
  order: Order

  @ApiProperty({ enum: OrderingProp })
  @IsEnum(OrderingProp)
  orderingProp: OrderingProp
}
export class ArticleStatisticResultDTO {
  @ApiProperty()
  @IsString()
  articleId: string;

  @ApiProperty()
  @IsNumber()
  views: number;

  @ApiProperty()
  @IsNumber()
  likes: number;

  @ApiProperty()
  @IsNumber()
  learners: number;

  @ApiProperty()
  @IsNumber()
  masters: number;

  @ApiProperty()
  @IsNumber()
  dagPoints: number;
}

export class ArticleStatisticCollectionResultDTO {
  @ApiProperty({ type: [ArticleStatisticResultDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleStatisticResultDTO)
  statistics: ArticleStatisticResultDTO[];
}
