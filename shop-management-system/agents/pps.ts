import { FPGrowth, Itemset } from 'node-fpgrowth';
import fs from "fs";
import { fetchTransactionHistory } from './oms';
import { getProductsByProductIds } from './ims';

// export default async function getReccomendations(products: IOrder[]): Promise<IProduct[]>{
//     const data: IProduct[] = [{
//         id: "567",
//         name: "Bag",
//         price: 100,
//         stock: 8,
//         image: ""
//       },
//       {
//         id: "569",
//         name: "Bottle",
//         price: 50,
//         stock: 90
//       },
//       {
//         id: "555",
//         name: "Pant",
//         price: 50,
//         stock: 90
//       }, {
//         id: "534",
//         name: "Shirt",
//         price: 50,
//         stock: 90
//       }, {
//         id: "509",
//         name: "Book",
//         price: 50,
//         stock: 90
//       }];
//     return data;
// }


// Function to get recommendations
export default async function getReccomendations(products: IOrder[]): Promise<IProduct[]> {
    const filePath = "./association_rules.json";
    const rawData = fs.readFileSync(filePath, "utf-8");
    const { associationRules }: { frequentItemsets: IFrequentItemset[]; associationRules: IAssociationRule[] } = JSON.parse(rawData);
    
    const productIds = products.map(order => order.product?.id ?? "").filter(id => id !== "");
  
    const recommendedProductIds: Set<string> = new Set();
  
    associationRules.forEach(rule => {
      if (rule.antecedent.every(item => productIds.includes(item))) {
        rule.consequent.forEach(item => {
          if (!productIds.includes(item)) {
            recommendedProductIds.add(item);
          }
        });
      }
    });
  
    const recommendedProducts: IProduct[] = await getProductsByProductIds([...recommendedProductIds]);
  
    return recommendedProducts;
  }
  

// Extract product sets from transactions
export function extractProductSets(transactions: ITransaction[]): string[][] {
  return transactions.map(transaction =>
    transaction.orders?.map(order => order.product?.id || "").filter(Boolean) || []
  );
}

// Generate frequent itemsets and association rulesimport FPGrowth from 'node-fpgrowth';

export async function generateAssociationRules(
    productSets: string[][],
    minSupport: number = 0.2,
    minConfidence: number = 0.6
  ): Promise<{ frequentItemsets: IFrequentItemset[]; associationRules: IAssociationRule[] }> {
    const fpgrowth = new FPGrowth<string>(minSupport);
  
    const frequentItemsets: IFrequentItemset[] = [];
    const associationRules: IAssociationRule[] = [];
  
    return new Promise((resolve, reject) => {
      fpgrowth.exec(productSets)
        .then(itemsets => {
          itemsets.forEach(itemset => {
            frequentItemsets.push({
              itemset: itemset.items,
              support: itemset.support
            });
          });
  
          // Generate association rules
          frequentItemsets.forEach(itemset => {
            const { itemset: items, support } = itemset;
            if (items.length > 1) {
              const subsets = getSubsets(items);
              subsets.forEach(antecedent => {
                const consequent = items.filter(item => !antecedent.includes(item));
                if (consequent.length > 0) {
                  const confidence = support / getSupport(antecedent, productSets);
                  if (confidence >= minConfidence) {
                    associationRules.push({
                      antecedent,
                      consequent,
                      confidence
                    });
                  }
                }
              });
            }
          });
  
          resolve({ frequentItemsets, associationRules });
        })
        .catch(error => {
          console.error("Error generating association rules:", error);
          reject(new Error("Failed to generate association rules."));
        });
    });
  }
  
  // Helper function to get all non-empty subsets of an array
  const getSubsets = (array: string[]): string[][] => {
    const subsets: string[][] = [];
    const subsetCount = Math.pow(2, array.length);
    for (let i = 1; i < subsetCount; i++) {
      const subset: string[] = [];
      for (let j = 0; j < array.length; j++) {
        if (i & (1 << j)) {
          subset.push(array[j]);
        }
      }
      subsets.push(subset);
    }
    return subsets;
  };
  
  // Helper function to calculate the support of an itemset
  const getSupport = (itemset: string[], productSets: string[][]): number => {
    let count = 0;
    productSets.forEach(transaction => {
      if (itemset.every(item => transaction.includes(item))) {
        count++;
      }
    });
    return count / productSets.length;
  };
  

// Save results to a file
export function saveToFile(
  frequentItemsets: IFrequentItemset[],
  associationRules: IAssociationRule[],
  filePath: string = "./association_rules.json"
): void {
  const output = {
    frequentItemsets,
    associationRules,
  };

  fs.writeFileSync(filePath, JSON.stringify(output, null, 2), "utf-8");
  console.log(`Association rules saved to ${filePath}`);
}

// Workflow function
export async function processTransactionsForAssociationRules() {
  try {
    const transactionList: ITransactionList = await fetchTransactionHistory("", "modifiedBy", "desc", 1, 10000);
    const productSets = extractProductSets(transactionList.transactions);

    // Generate association rules
    const { frequentItemsets, associationRules } = await generateAssociationRules(productSets, 0.2, 0.6);

    // Save results
    saveToFile(frequentItemsets, associationRules, "./association_rules.json");
  } catch (error) {
    throw new Error(`Error processing transactions for association rules: ${error}`);
  }
}

