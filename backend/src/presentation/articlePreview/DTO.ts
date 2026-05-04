import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PreviewOrder, PreviewOrderingProp } from '../../domain/articlePreview/entity';

export class GetByIdsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}

export class OrderDto{
  @ApiProperty({ enum: PreviewOrder })
  @IsEnum(PreviewOrder)
  order: PreviewOrder

  @ApiProperty({ enum: PreviewOrderingProp })
  @IsEnum(PreviewOrderingProp)
  orderingProp: PreviewOrderingProp
}

export class ArticlePreviewResultDTO {
  @ApiProperty()
  @IsString()
  articleId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  authorId: string;

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

export class ArticlePreviewCollectionResultDTO {
  @ApiProperty({ type: [ArticlePreviewResultDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticlePreviewResultDTO)
  previews: ArticlePreviewResultDTO[];
}
