
export interface SingleCategory {
  id: number,
  name: string,
  imageUrl: string
}


export interface Category {
  category: SingleCategory,
  categories: SingleCategory[]
}