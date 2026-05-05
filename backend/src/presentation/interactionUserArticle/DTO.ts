import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { LearnProgressStage } from "../../domain/interactionUserArticle/learnProgress/entity";
import { Type } from "class-transformer";


export class UpdateLearnProgressDto {
    @ApiProperty({ enum: LearnProgressStage })
    @IsEnum(LearnProgressStage)
    stage: LearnProgressStage;
}
export class InteractionResultDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    articleId: string;

    @ApiProperty()
    isViewed: boolean;

    @ApiProperty()
    isLiked: boolean;

    @ApiProperty({ enum: LearnProgressStage })
    learnProgressStage: LearnProgressStage;
    @ApiProperty({
        type: String,
        format: 'date-time',
        example: '2026-04-17T12:34:56.789Z',
        nullable: true,
    })
    lastInteraction: string | null;
}

export class LikeDto {
    @ApiProperty()
    articleId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({
        type: String,
        format: 'date-time',
        example: '2026-04-17T12:34:56.789Z',
    })
    timestamp: string;
}

export class ViewDto {
    @ApiProperty()
    articleId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({
        type: String,
        format: 'date-time',
        example: '2026-04-17T12:34:56.789Z',
    })
    timestamp: string;
}

export class LearnProgressDto {
    @ApiProperty()
    articleId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ enum: LearnProgressStage })
    learnProgressStage: LearnProgressStage;

    @ApiProperty({
        type: String,
        format: 'date-time',
        example: '2026-04-17T12:34:56.789Z',
    })
    updatedAt: string;
}

export class TotalByIdsDto {
    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    ids: string[];
}
