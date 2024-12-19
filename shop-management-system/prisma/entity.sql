
CREATE TABLE IF NOT EXISTS public."Entity"
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    "entityType" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    "number" character varying(50) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    role character varying(50) COLLATE pg_catalog."default",
    image text COLLATE pg_catalog."default",
    price double precision,
    quantity integer,
    description text COLLATE pg_catalog."default",
    category character varying(255) COLLATE pg_catalog."default",
    "jsonPayload" text COLLATE pg_catalog."default",
    "modifiedOn" timestamp without time zone,
    "modifiedBy" uuid,
    CONSTRAINT "Entity_pkey" PRIMARY KEY (id)
)
