import { Entity } from "../../prisma/schema";

type ObjectId = string;

export enum Roles {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'Employee',
}

export enum EntityType {
  TRANSACTION = 'TRANSACTION',
  ORDER = 'ORDER',
  CUSTOMER = 'CUSTOMER',
  USER = 'USER',
  PRODUCT = 'PRODUCT',
}

export interface IEntity {
  id: ObjectId;
  entityType: EntityType;
  name?: string;
  email?: string;
  number?: string;
  password?: string;
  role?: Roles;
  image?: string;
  price?: number;
  quantity?: number;
  description?: string;
  category?: string;
  jsonPayload?: string;
  modifiedOn?: Date;
  modifiedBy?: ObjectId;
}

export type EntityInsert = typeof Entity.$inferInsert;
