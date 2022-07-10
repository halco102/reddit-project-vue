
 export interface SingleCategory {
    id : number,
    name : string
}


export interface Category {
  category: SingleCategory,
  categories: SingleCategory[]
}