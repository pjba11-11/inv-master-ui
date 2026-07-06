import { NextResponse } from 'next/server';

// Mock data for materials
let materials = [
  {
    id: '1',
    name: 'Steel Rod',
    description: 'Carbon steel rod, 10mm diameter, 2m length',
    unit: 'kg',
    currentPrice: 15.50,
    supplier: 'SteelWorks Inc.',
    isActive: true
  },
  {
    id: '2',
    name: 'Copper Wire',
    description: 'Insulated copper wire, 12 AWG, 100m roll',
    unit: 'm',
    currentPrice: 2.75,
    supplier: 'ElectroSupply Co.',
    isActive: true
  },
  {
    id: '3',
    name: 'Plastic Sheet',
    description: 'PVC sheet, 4x8 ft, 3mm thickness',
    unit: 'sqm',
    currentPrice: 12.00,
    supplier: 'Plastics Plus',
    isActive: false
  }
];

// Mock data for price history
let priceHistory = [
  {
    id: '1',
    materialId: '1',
    price: 14.00,
    effectiveDate: '2024-01-01',
    recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
  },
  {
    id: '2',
    materialId: '1',
    price: 15.50,
    effectiveDate: '2024-02-01',
    recordedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  },
  {
    id: '3',
    materialId: '1',
    price: 16.00,
    effectiveDate: '2024-03-01',
    recordedAt: new Date().toISOString() // today
  },
  {
    id: '4',
    materialId: '2',
    price: 2.50,
    effectiveDate: '2024-01-15',
    recordedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days ago
  },
{
    id: '5',
    materialId: '2',
    price: 2.75,
    effectiveDate: '2024-03-01',
    recordedAt: new Date().toISOString() // today
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const active = searchParams.get('active');
  
  let filteredMaterials = materials;
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredMaterials = filteredMaterials.filter(material => 
      material.name.toLowerCase().includes(searchLower) ||
      material.description.toLowerCase().includes(searchLower) ||
      material.unit.toLowerCase().includes(searchLower) ||
      (material.supplier && material.supplier.toLowerCase().includes(searchLower))
    );
  }
  
  if (active !== null) {
    const isActive = active === 'true';
    filteredMaterials = filteredMaterials.filter(material => material.isActive === isActive);
  }
  
  return NextResponse.json(filteredMaterials);
}

export async function POST(request: Request) {
  const newMaterial = await request.json();
  const material = {
    id: Date.now().toString(),
    ...newMaterial
  };
  materials.push(material);
  return NextResponse.json(material, { status: 201 });
}
