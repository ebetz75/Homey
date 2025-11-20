
export enum Category {
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  CLOTHING = 'Clothing',
  KITCHEN = 'Kitchen',
  BOOKS = 'Books',
  TOOLS = 'Tools',
  ART = 'Art/Decor',
  APPLIANCES = 'Appliances',
  FIXTURES = 'Fixtures/Lighting',
  HVAC = 'HVAC/Systems',
  OTHER = 'Other'
}

export enum Condition {
  NEW = 'New',
  LIKE_NEW = 'Like New',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor'
}

export enum ItemType {
  PERSONAL = 'Personal Property (Moves)',
  FIXTURE = 'Fixture (Stays with Home)'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: Category | string;
  room: string;
  type: ItemType;
  value: number;
  purchaseDate: string;
  description: string;
  condition: Condition | string;
  imageUrl?: string;
  receiptUrl?: string;
  createdAt: number;
}

export interface AnalysisResult {
  name: string;
  category: string;
  room: string;
  type: ItemType;
  estimatedValue: number;
  description: string;
  condition: string;
}

export type ViewState = 'DASHBOARD' | 'ADD' | 'SETTINGS' | 'DETAILS';
