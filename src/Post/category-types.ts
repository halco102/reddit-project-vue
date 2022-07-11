
 export interface SingleCategory {
    id : number,
    name : string,
    iconUrl: string
}


export interface Category {
  category: SingleCategory,
  categories: SingleCategory[]
}