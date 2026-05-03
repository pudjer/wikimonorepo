import api from "../api";
import { builder, CompileString, UUIDPattern } from "./storeConfig";

export class Author {
  id: string;
  username: string;
}
const UserPattern = "user";

builder.buildRuleSimple(
  CompileString([UserPattern, UUIDPattern]),
  Author,
  async (author, key) => {
    const segments = key.split('/');
    const userId = segments[1];
    const data = await api.publicUser.get(userId);

    author.id = data.id;

    author.username = data.username;
  }
);

export const getAuthorKey = (id: string) => CompileString([UserPattern, id])