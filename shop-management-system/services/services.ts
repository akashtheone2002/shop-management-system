import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function insertEntity(data: IEntity) {
  return await prisma.entity.create({ data });
}

export async function bulkInsertEntity(data: IEntity[]){
    return await prisma.entity.createMany({ data });
}

export async function updateEntity(id: string, data: IEntity) {
  return await prisma.entity.update({
    where: { id },
    data,
  });
}

export async function getEntity(id: string) {
  return await prisma.entity.findUnique({
    where: { id },
  }) as IEntity;
}

export async function getEntityByCondition(condition: Prisma.EntityWhereInput) {
  return await prisma.entity.findFirst({
    where: condition,
  }) as IEntity;
}

export async function getEntitiesByCondition(condition: Prisma.EntityWhereInput) {
  return await prisma.entity.findMany({
    where: condition,
  }) as IEntity[];
}

export async function deleteEntity(id: string) {
    const result =  await prisma.entity.delete({
        where: { id },
    });
    return result;
}

export async function getEntities(
  type: EntityType,
  search?: string,
  sort?: string,
  order?: "asc" | "desc",
  page?: number,
  pageSize?: number
) : Promise<IEntity[]> {
  pageSize = pageSize || 10;
  page = page || 1;
  search = search || "";
  order = order || "asc";
  sort = sort || "modifiedOn";

  const skip = page && pageSize ? (page - 1) * pageSize : 0;
  const take = pageSize ? pageSize : 10;

  return await prisma.entity.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { number: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ],
      AND: [{ entityType: type }],
    },
    orderBy: sort ? { [sort]: order } : undefined,
    skip,
    take,
  }) as IEntity[];
}

export async function getPaginationMetaData(
  type: EntityType,
  search?: string,
  page?: number,
  pageSize?: number
): Promise<IMetaData> {
  pageSize = pageSize || 10;
  page = page || 1;
  search = search || "";

  // Step 1: Get the total number of records matching the criteria
  const totalRecords = await prisma.entity.count({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { number: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ],
      AND: [{ entityType: type }],
    },
  });

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


export async function userLogin(userName: string, password: string) : Promise<IEntity>{
  const entity = await prisma.entity.findFirst({
    where: {
      AND: [
        { name: { contains: userName, mode: "insensitive" } },
        { password: { contains: password, mode: "insensitive" } },
        { entityType: EntityType.USER },
      ],
    },
  });
  if (!entity) {
    throw new Error('User not found or invalid credentials');
    }
    return entity as IEntity;
}
