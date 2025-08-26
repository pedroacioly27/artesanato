import { AppDataSource } from "../data-source";
import { Record } from "../entities/Record.entity";

export const recordRepository = AppDataSource.getRepository(Record);
