import { apiClient } from './apiClient';

const BASE_PATH = '/products';
const ASSETS_BASE_URL = (import.meta.env.VITE_ASSETS_BASE_URL ?? '').replace(/\/$/, '');

const mapProduct = (product) => ({
  ...product,
  imagen: product.imagenUrl ?? buildImageUrl(product.codigo),
});

const buildImageUrl = (codigo) => {
  if (!codigo) return null;
  if (!ASSETS_BASE_URL) return null;
  return `${ASSETS_BASE_URL}/${codigo}.jpg`;
};

export const productService = {
  async getAll() {
    const products = await apiClient.get(BASE_PATH);
    return products.map(mapProduct);
  },

  async getByCodigo(codigo) {
    const product = await apiClient.get(`${BASE_PATH}/${codigo}`);
    return mapProduct(product);
  },

  async getCategories() {
    return apiClient.get(`${BASE_PATH}/categories`);
  },
};
