export type GameMode = 'grocery_dash' | 'grand_prix' | 'free_roam';

export interface CalfSkin {
  id: string;
  name: string;
  description: string;
  bodyColor: string;
  spotColor: string;
  accentColor: string;
  bellColor: string;
  speed: number;       // 1 - 5
  handling: number;    // 1 - 5
  durability: number;  // 1 - 5
  boostPower: number;  // 1 - 5
}

export interface GroceryItem {
  id: string;
  name: string;
  category: 'dairy' | 'cereal' | 'produce' | 'canned' | 'bakery' | 'frozen';
  icon: string;
  color: string;
  points: number;
}

export interface ShoppingTarget {
  item: GroceryItem;
  needed: number;
  collected: number;
}

export interface ShelfObject {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  rotation: number;
  sectionName: string;
  category: string;
  color: string;
  health: number; // 0 to 100
  isCollapsed: boolean;
  wobbleIntensity: number;
  meshGroup?: any;
}

export interface PickupInstance {
  id: string;
  x: number;
  y: number;
  z: number;
  type: 'grocery' | 'boost' | 'repair' | 'coin';
  groceryItem?: GroceryItem;
  mesh?: any;
  collected: boolean;
}

export interface HazardInstance {
  id: string;
  x: number;
  z: number;
  type: 'wet_floor' | 'shopping_cart' | 'banana';
  mesh?: any;
  vx?: number;
  vz?: number;
}

export interface Checkpoint {
  x: number;
  z: number;
  radius: number;
  order: number;
}

export interface GameStats {
  score: number;
  damageCost: number; // in dollars
  shelvesDestroyed: number;
  itemsCollected: number;
  currentLap: number;
  totalLaps: number;
  timeElapsed: number;
  maxSpeed: number;
  driftPoints: number;
}
