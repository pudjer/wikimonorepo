import { Injectable } from "@nestjs/common";
import { QueryTextValidator, QueryText, BadQueryTextError } from "../../../../domain/search/props/query";

const MAX_QUERY_LENGTH = 500;

const QUERY_TEXT_REGEX =
  /^[\p{L}\p{N}\p{P}\p{S}\s]{1,500}$/u;

const FORBIDDEN_UNICODE = /[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\uFEFF]/g;

@Injectable()
export class QueryTextValidatorImpl implements QueryTextValidator {
  async validate(raw: string): Promise<QueryText> {
    if (typeof raw !== 'string') {
      throw new BadQueryTextError(`Invalid query text type`);
    }

    const trimmed = raw.trim();

    if (trimmed.length === 0) {
      throw new BadQueryTextError(`Query text is empty`);
    }

    if (trimmed.length > MAX_QUERY_LENGTH) {
      throw new BadQueryTextError(
        `Query too long: ${trimmed.length}. Max is ${MAX_QUERY_LENGTH}`
      );
    }

    // защита от zero-width, bidi override и control chars
    if (FORBIDDEN_UNICODE.test(trimmed)) {
      throw new BadQueryTextError(
        `Query contains forbidden invisible/control characters`
      );
    }

    if (!QUERY_TEXT_REGEX.test(trimmed)) {
      throw new BadQueryTextError(
        `Invalid query text: '${raw}'. Allowed: letters, numbers, spaces, punctuation, symbols`
      );
    }

    return trimmed as QueryText;
  }
}