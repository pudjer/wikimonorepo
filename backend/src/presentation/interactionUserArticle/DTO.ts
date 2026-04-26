import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { LearnProgressStage } from "../../domain/interactionUserArticle/learnProgress/entity";


export class UpdateLearnProgressDto {
    @ApiProperty({ enum: LearnProgressStage })
    @IsEnum(LearnProgressStage)
    stage: LearnProgressStage;
}
export class InteractionResultDto {
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

