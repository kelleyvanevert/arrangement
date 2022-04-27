
create table "users"(
  "id" serial primary key,
  "email" varchar not null unique,
  "name" varchar not null,
  "password_hash" varchar not null
);
