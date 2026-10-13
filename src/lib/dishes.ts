import type { ImageMetadata } from 'astro';
import data from '../data/dishes.json';
import type { L10n } from '../data/site';

export interface Dish {
  id: string;
  file: string;
  kind: 'dish' | 'portrait';
  steam?: boolean;
  title: L10n;
  notes?: L10n;
  alt: L10n;
  igUrl: string;
}

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/dishes/*.jpg', { eager: true });

export const dishes = (data as Dish[]).filter((d) => d.kind === 'dish');

export const photo = (id: string) => {
  const d = (data as Dish[]).find((x) => x.id === id);
  if (!d) throw new Error(`Foto ${id} no está en dishes.json`);
  return d;
};

export const imageFor = (d: Dish) => {
  const img = images[`../assets/dishes/${d.file}`];
  if (!img) throw new Error(`Falta src/assets/dishes/${d.file}`);
  return img.default;
};
