import createDebug from 'debug';
import { MangaRepo } from './manga.repo.interface.js';
import { Manga } from '../../entities/manga.js';
import { MangaModel } from './manga.mongo.model.js';
import { HTTPError } from '../../errors/errors.js';

const debug = createDebug('BB:mangas');

export class MangaMongoRepo implements MangaRepo<Manga> {
  private static instanced: MangaMongoRepo;

  public static getInstance(): MangaMongoRepo {
    if (!MangaMongoRepo.instanced) {
      MangaMongoRepo.instanced = new MangaMongoRepo();
    }

    return MangaMongoRepo.instanced;
  }

  private constructor() {
    debug('Instantiate Manga');
  }

  async getAllMangas(): Promise<Manga[]> {
    const data = await MangaModel.find();
    return data;
  }

  async getOneManga(id: string): Promise<Manga> {
    const data = await MangaModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found');
    return data;
  }

  async searchManga(query: { key: string; value: unknown }): Promise<Manga[]> {
    const data = await MangaModel.find({ [query.key]: query.value });
    return data;
  }

  async createManga(info: Partial<Manga>): Promise<Manga> {
    const data = await MangaModel.create(info);
    return data;
  }

  async updateManga(info: Partial<Manga>): Promise<Manga> {
    const data = await MangaModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data)
      throw new HTTPError(
        402,
        'Not possible',
        'Was not possible to update manga'
      );
    return data;
  }

  async deleteManga(id: string): Promise<void> {
    const data = await MangaModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        402,
        'Not possible',
        'Was not possible to delete manga'
      );
  }
}
