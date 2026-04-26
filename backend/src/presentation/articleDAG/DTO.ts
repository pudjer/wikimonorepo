import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetArticleDAGQueryDto {
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @IsArray()
    @IsString({ each: true })
    ids: string[];
}

export class ArticleDAGResultDTO {
  @ApiProperty({ type: [String], description: 'Article node IDs' })
  @IsArray()
  @IsString({ each: true })
  nodes: string[];

  @ApiProperty({ description: 'Article relations (links)' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleLinkDTO)
  links: ReadonlyArray<ArticleLinkDTO>;
}

export class ArticleLinkDTO {
  @ApiProperty()
  @IsString()
  child: string;

  @ApiProperty()
  @IsString()
  parent: string;

  @ApiProperty()
  @IsString()
  name: string;
}

