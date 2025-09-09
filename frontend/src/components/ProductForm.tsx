import { useState, useEffect } from 'react';

interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  supplier_email: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    supplier_email: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category,
        supplier_email: product.supplier_email || '',
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Preparar dados para envio, convertendo campos vazios para undefined quando apropriado
    const submissionData = {
      ...formData,
      description: formData.description.trim() === '' ? undefined : formData.description.trim(),
      supplier_email: formData.supplier_email.trim(), // Agora é obrigatório, não converte para undefined
    };
    
    onSubmit(submissionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Nome do Produto <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          placeholder="Digite o nome do produto"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Descrição <span className="text-gray-400 text-xs">(opcional)</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          placeholder="Descreva o produto (opcional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Preço (R$) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          placeholder="Ex: 0.00, 10.50, 100.00"
        />
        <p className="text-xs text-gray-500 mt-1">Aceita valores a partir de R$ 0,00</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Categoria <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          placeholder="Ex: Eletrônicos, Roupas, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Email do Fornecedor <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="supplier_email"
          value={formData.supplier_email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          placeholder="fornecedor@email.com"
        />
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <span className="text-red-500">*</span> Campos obrigatórios: Nome, Preço, Categoria e Email do Fornecedor
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
