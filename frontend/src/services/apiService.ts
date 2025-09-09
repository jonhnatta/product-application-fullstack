const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  supplier_email: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  supplier_email: string;
}

class ApiService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    const response = await this.fetchWithErrorHandling('/products/');
    return response.json();
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.fetchWithErrorHandling(`/products/${id}/`);
    return response.json();
  }

  async createProduct(product: ProductInput): Promise<Product> {
    const response = await this.fetchWithErrorHandling('/products/', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return response.json();
  }

  async updateProduct(id: number, product: ProductInput): Promise<Product> {
    const response = await this.fetchWithErrorHandling(`/products/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    return response.json();
  }

  async deleteProduct(id: number): Promise<void> {
    await this.fetchWithErrorHandling(`/products/${id}/`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
