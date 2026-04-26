import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, Min, Max, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchArticlesQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  query: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform((params: { value: string }) => Number(params.value))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, maximum: 100 })
  @IsOptional()
  @Transform((params: { value: string }) => Number(params.value))
  @IsInt()
  @Min(1)
  @Max(100)
  size: number = 10;
}

export class SearchInArticlesQueryDto extends SearchArticlesQueryDto {
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  articleIds: string[];
}

export class ArticleSearchResultDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  contentSnippet: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  relevanceScore: number;
}

export class SearchArticlesResultDto {
  @ApiProperty({ type: [ArticleSearchResultDto] })
  results: ArticleSearchResultDto[];
}

