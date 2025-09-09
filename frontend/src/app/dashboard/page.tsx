'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Package, Users, Tag, DollarSign } from 'lucide-react';
import { apiService, Product } from '@/services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProducts();
        console.log('Dados recebidos da API:', data);
        console.log('Primeiro produto:', data[0]);
        if (data[0]) {
          console.log('Tipo do price:', typeof data[0].price, 'Valor:', data[0].price);
        }
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    const validPrice = isNaN(price) || !isFinite(price) ? 0 : price;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(validPrice);
  };


  const getValidPrice = (product: Product): number => {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    
    return isNaN(price) || !isFinite(price) ? 0 : price;
  };

  // 1. Quantidade de Produtos por Fornecedor
  const productsBySupplier = products.reduce((acc, product) => {
    const supplier = product.supplier_email;
    acc[supplier] = (acc[supplier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const supplierData = Object.entries(productsBySupplier).map(([supplier, count]) => ({
    name: supplier.split('@')[0], // Pega apenas a parte antes do @
    value: count,
    fullEmail: supplier
  }));

  // 2. Valor Médio dos Produtos por Fornecedor
  const avgPriceBySupplier = products.reduce((acc, product) => {
    const supplier = product.supplier_email;
    if (!acc[supplier]) {
      acc[supplier] = { total: 0, count: 0 };
    }
    acc[supplier].total += getValidPrice(product);
    acc[supplier].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const avgPriceData = Object.entries(avgPriceBySupplier).map(([supplier, data]) => ({
    name: supplier.split('@')[0],
    value: Math.round((data.total / data.count) * 100) / 100,
    fullEmail: supplier
  }));

  // 3. Valor Total de Estoque por Categoria
  const totalValueByCategory = products.reduce((acc, product) => {
    const category = product.category;
    acc[category] = (acc[category] || 0) + getValidPrice(product);
    return acc;
  }, {} as Record<string, number>);

  const categoryValueData = Object.entries(totalValueByCategory).map(([category, total]) => ({
    name: category,
    value: Math.round(total * 100) / 100
  }));

  // 4. Quantidade de Produtos por Categoria
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryCountData = Object.entries(productsByCategory).map(([category, count]) => ({
    name: category,
    value: count
  }));

  // Calcular valor total
  const totalValue = products.reduce((sum, product) => {
    const price = getValidPrice(product);
    console.log(`Produto: ${product.name}, Price original: ${product.price}, Price válido: ${price}`);
    return sum + price;
  }, 0);
  
  console.log('Valor total calculado:', totalValue);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Package className="h-5 w-5" />
              Produtos
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-gray-700">Total de Produtos</CardTitle>
              <Package className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{products.length}</div>
              <p className="text-sm text-gray-600 mt-1">produtos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-gray-700">Fornecedores</CardTitle>
              <Users className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{Object.keys(productsBySupplier).length}</div>
              <p className="text-sm text-gray-600 mt-1">fornecedores únicos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-gray-700">Categorias</CardTitle>
              <Tag className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{Object.keys(productsByCategory).length}</div>
              <p className="text-sm text-gray-600 mt-1">categorias diferentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-gray-700">Valor Total</CardTitle>
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 break-words">
                {formatPrice(totalValue)}
              </div>
              <p className="text-sm text-gray-600 mt-1">valor total do estoque</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Quantidade de Produtos por Fornecedor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Produtos por Fornecedor</CardTitle>
              <CardDescription className="text-gray-600">
                Quantidade de produtos oferecidos por cada fornecedor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supplierData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name, props) => [
                    `${value} produtos`,
                    props.payload?.fullEmail || name
                  ]} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 2. Valor Médio dos Produtos por Fornecedor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Preço Médio por Fornecedor</CardTitle>
              <CardDescription className="text-gray-600">
                Valor médio dos produtos de cada fornecedor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={avgPriceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name, props) => [
                    formatPrice(Number(value)),
                    props.payload?.fullEmail || name
                  ]} />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 3. Valor Total de Estoque por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Valor de Estoque por Categoria</CardTitle>
              <CardDescription className="text-gray-600">
                Distribuição do valor total do inventário por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryValueData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryValueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      const totalValue = categoryValueData.reduce((sum, item) => sum + item.value, 0);
                      const percentage = ((value / totalValue) * 100).toFixed(1);
                      return [
                        `${formatPrice(value)} (${percentage}%)`, 
                        name
                      ];
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={60}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 4. Quantidade de Produtos por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Produtos por Categoria</CardTitle>
              <CardDescription className="text-gray-600">
                Quantidade de produtos em cada categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryCountData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                  <Bar dataKey="value" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
