type ObjectId = string;

enum Roles {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'Employee',
}

enum EntityType {
  TRANSACTION = 'TRANSACTION',
  ORDER = 'ORDER',
  CUSTOMER = 'CUSTOMER',
  USER = 'USER',
  PRODUCT = 'PRODUCT',
}

interface IEntity {
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
