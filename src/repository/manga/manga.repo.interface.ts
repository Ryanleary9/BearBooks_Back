export interface MangaRepo<M> {
  getAllMangas(): Promise<M[]>;
  getOneManga(_id: string): Promise<M>;
  searchManga(query: { [key: string]: unknown }): Promise<M[]>;
  createManga(_info: Partial<M>): Promise<M>;
  updateManga(_info: Partial<M>): Promise<M>;
  deleteManga(_id: string): Promise<void>;
}
