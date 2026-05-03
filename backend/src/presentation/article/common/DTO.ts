import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from "class-transformer";

export class ArticleReferenceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  parent: string;
}

export class UpdateArticleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ type: [ArticleReferenceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleReferenceDto)
  links?: ArticleReferenceDto[];
}

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: [ArticleReferenceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleReferenceDto)
  links: ArticleReferenceDto[];
}

export class ArticleResultDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  authorId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: [ArticleReferenceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleReferenceDto)
  links: ArticleReferenceDto[];

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-04-17T12:34:56.789Z',
  })
  @IsString()
  createdAt: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-04-17T12:34:56.789Z',
  })
  @IsString()
  updatedAt: string;
}


export class ArticleIdCollectionResultDTO {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}

export class MinifiedArticleResultDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  authorId: string;
}

