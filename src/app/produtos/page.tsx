'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { ProductsSummaryCards } from '@/components/products/products-summary-cards';
import { ProductsTable } from '@/components/products/products-table';
import { ProductDetailsDrawer } from '@/components/products/product-details-drawer';
import { NewProductModal } from '@/components/products/new-product-modal';
import { ProductData, PRODUCT_CATEGORIES } from '@/types/products';
import { productService } from '@/services/product-service';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');

  // Carrega produtos persistidos
  const loadProducts = useCallback(() => {
    const list = productService.getAll();
    setProducts(list);
    setIsLoaded(true);

    // Se o drawer estiver aberto com um produto, sincroniza os dados dele
    if (selectedProduct) {
      const refreshed = list.find((p) => p.id === selectedProduct.id) || null;
      setSelectedProduct(refreshed);
    }
  }, [selectedProduct]);

  useEffect(() => {
    loadProducts();
  }, []);

  // Métricas calculadas dinamicamente
  const summaryMetrics = useMemo(() => {
    return productService.calculateSummary(products);
  }, [products]);

  // Filtragem combinada
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch =
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || prod.status === statusFilter;
      const matchCategory = categoryFilter === 'Todos' || prod.category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [products, searchTerm, statusFilter, categoryFilter]);

  const handleOpenCreateModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductData) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (savedProduct: ProductData) => {
    loadProducts();
    if (selectedProduct && selectedProduct.id === savedProduct.id) {
      setSelectedProduct(savedProduct);
    }
  };

  const handleToggleStatus = (productId: string) => {
    const res = productService.toggleStatus(productId);
    if (res.success && res.product) {
      loadProducts();
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct(res.product);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Sidebar Reutilizável com rota ativa destacada */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/produtos"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header Consistente */}
        <Header
          title="Produtos"
          description="Gerencie os produtos comercializados pela Veneza Brownies."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          actionButton={{
            label: 'Novo Produto',
            onClick: handleOpenCreateModal,
          }}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Summary Cards - Dinâmicos e Persistentes */}
          <ProductsSummaryCards metrics={summaryMetrics} />

          {/* Filter Toolbar */}
          <div className="p-4 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7f74]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, SKU ou descrição..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-[#2a221b] dark:text-[#f5f0eb] placeholder-[#8c7f74] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
            </div>

            {/* Filter Selects */}
            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-start md:justify-end text-xs">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#8c7f74] dark:text-[#8a7f75] font-semibold text-[11px] uppercase">
                  Categoria:
                </span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#8c7f74] dark:text-[#8a7f75] font-semibold text-[11px] uppercase">
                  Situação:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Table with Row Clicks */}
          <ProductsTable
            products={filteredProducts}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
          />
        </main>
      </div>

      {/* Product Details Drawer */}
      <ProductDetailsDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEdit={(prod) => {
          setSelectedProduct(null);
          handleOpenEditModal(prod);
        }}
        onToggleStatus={handleToggleStatus}
      />

      {/* New / Edit Product Modal */}
      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }}
        onSuccess={handleModalSuccess}
        productToEdit={productToEdit}
      />
    </div>
  );
}
