import { IProduct } from "@/type";

export default function getReccomendations(): IProduct[]{
    const data: IProduct[] = [{
        id: "567",
        name: "Bag",
        price: 100,
        stock: 8
      },
      {
        id: "569",
        name: "Bottle",
        price: 50,
        stock: 90
      }];
    return data;
}