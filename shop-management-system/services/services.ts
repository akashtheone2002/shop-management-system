import { IMetaData } from "@/types/apiModels/apiModels";
import { EntityInsert, EntityType, IEntity } from "@/types/entity/entity";
import { db } from "./dbContext";
import { Entity } from "../prisma/schema";
import { and, asc, desc, eq, ilike, isNotNull, or } from 'drizzle-orm';

export async function InsertEntity(data: EntityInsert) {
  const result =  await db.insert(Entity).values(data).returning({
    id: Entity.id, entityType: Entity.entityType, name: Entity.name, email: Entity.email, number: Entity.number, password: Entity.password, role: Entity.role, image: Entity.image, price: Entity.price, quantity: Entity.quantity, description: Entity.description, category: Entity.category, jsonPayload: Entity.jsonPayload, modifiedOn: Entity.modifiedOn, modifiedBy: Entity.modifiedBy
  }).execute();
  return result[0];
}

export async function BulkInsertEntity(data: EntityInsert[]){
    const result = await db.insert(Entity).values(data).returning({
      id: Entity.id, entityType: Entity.entityType, name: Entity.name, email: Entity.email, number: Entity.number, password: Entity.password, role: Entity.role, image: Entity.image, price: Entity.price, quantity: Entity.quantity, description: Entity.description, category: Entity.category, jsonPayload: Entity.jsonPayload, modifiedOn: Entity.modifiedOn, modifiedBy: Entity.modifiedBy
    }).execute()
    return result;
}

export async function UpdateEntity(id: string, data: EntityInsert) {
  const result =  await db.update(Entity).set(data).where(eq(Entity.id, id)).returning({
    id: Entity.id, entityType: Entity.entityType, name: Entity.name, email: Entity.email, number: Entity.number, password: Entity.password, role: Entity.role, image: Entity.image, price: Entity.price, quantity: Entity.quantity, description: Entity.description, category: Entity.category, jsonPayload: Entity.jsonPayload, modifiedOn: Entity.modifiedOn, modifiedBy: Entity.modifiedBy
  }).execute();
  return result[0];
}

export async function GetEntity(id: string) {
  const query = `SELECT * FROM "Entity" WHERE id = '${id}'`;
  const result =  await db.execute(query);
  return result.rows[0] as EntityInsert;
}

export async function GetEntityByCondition(condition: string) {
  const query = `SELECT * FROM "Entity" WHERE ${condition}`;
  const result =  await db.execute(query);
  return result.rows[0] as EntityInsert;
}

export async function GetEntitiesByCondition(condition: string) {
  const query = `SELECT * FROM "Entity" WHERE ${condition}`;
  const result =  await db.execute(query);
  return result.rows as IEntity[];
}

export async function DeleteEntity(id: string) {
    const result =  await db.delete(Entity).where(eq(Entity.id, id));
    return result;
}

export async function GetEntities(
  type: EntityType,
  search?: string,
  sort?: string,
  order?: 'asc' | 'desc',
  page?: number,
  pageSize?: number
): Promise<IEntity[]> {
  pageSize = pageSize || 10;
  page = page || 1;
  search = search || '';
  order = order || 'asc';
  sort = sort || 'modifiedOn';

  const skip = (page - 1) * pageSize;
  const take = pageSize;
  let whereCondition;
  let searchCondition;
  if(search && search.length > 0){
    searchCondition = or(ilike(Entity.name,LikeCondtionString(search)), ilike(Entity.email, LikeCondtionString(search)), ilike(Entity.number, LikeCondtionString(search)), ilike(Entity.category, LikeCondtionString(search)));
    whereCondition = and(eq(Entity.entityType, type), searchCondition)
  }
  whereCondition = eq(Entity.entityType, type)
  const result = await db
    .select()
    .from(Entity)
    .where(whereCondition)
    .orderBy(desc(Entity.modifiedBy))
    .limit(take)
    .offset(skip)
    .execute();

  return result as IEntity[];
}


export async function GetPaginationMetaData(
  type: EntityType,
  search?: string,
  page?: number,
  pageSize?: number
): Promise<IMetaData> {
  pageSize = pageSize || 10;
  page = page || 1;
  search = search || "";
// Define the condition for search
const searchCondition = or(
  ilike(Entity.name, `%${search}%`),
  ilike(Entity.email, `%${search}%`),
  ilike(Entity.number, `%${search}%`),
  ilike(Entity.category, `%${search}%`)
);

// Define the where condition with entity type
const whereCondition = and(
  eq(Entity.entityType, type),
  searchCondition
);

// Count the total number of records
const totalRecords = await db
  .select()
  .from(Entity)
  .where(whereCondition)
  .execute()
  .then((result) => result.length);

  // Step 2: Calculate totalPages
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Step 3: Return metadata
  const metaData: IMetaData = {
    currentPage: page,
    totalPages: totalPages,
    totalRecords: totalRecords,
    limit: pageSize,
  };

  return metaData;
}


export async function UserLogin(userName: string, password: string){
  const result = await db.select().from(Entity).where(and(eq(Entity.email, userName), eq(Entity.password, password)));
  if (!result) {
    throw new Error('User not found or invalid credentials');
    }
    return result[0];
}

function LikeCondtionString(param:string) : string {
  return `%${param}%`;
}