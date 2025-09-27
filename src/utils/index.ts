import { logger } from "@/lib/winston";
import { GetLinkProps } from "./types";

type GenPrevLinkProps = Omit<GetLinkProps, "total">;

export const generateTTL = (tokenExp: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const secondsToExpire = tokenExp - currentTime;
  return secondsToExpire > 0 ? secondsToExpire : 0;
};

export const generateRedisUserKey = (userId: string) => {
  return "user-" + userId;
};

export const generateRedisTokenKey = (email: string) => {
  return "token-" + email;
};

export const generateBackHalf = (length: number = 5): string => {
  const char: string = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
  let backHalf: string = "";

  for (let i = 0; i < length; i++) {
    backHalf += char[Math.floor(Math.random() * char.length)];
  }

  return backHalf;
};

export const generateNextLink = ({
  baseUrl,
  search,
  sortby,
  offset,
  limit,
  total,
}: GetLinkProps): string | null => {
  if (total <= limit + offset) return null;
  const origin =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "my_prod_url";

  const url = new URL(`${origin}${baseUrl}`);

  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (sortby) params.set("sortby", sortby);

  params.set("offset", String(offset + limit));
  params.set("limit", String(limit));

  // url returns http://localhost:3000/api/links
  url.search = params.toString();
  // url.search then adds ?search=&sortby=&offset=&limit= to the url
  // final url = http://localhost:3000/api/links?search=&sortby=&offset=&limit=105
  const nextLink = url.toString();
  return nextLink;
};

export const generatePrevLink = ({
  baseUrl,
  search,
  sortby,
  offset,
  limit,
}: GenPrevLinkProps): string | null => {
  if (offset <= 0) return null;
  const origin =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "my_prod_url";

  const url = new URL(`${origin}${baseUrl}`);

  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (sortby) params.set("sortby", sortby);

  params.set("offset", String(offset - limit <= 0 ? 0 : offset - limit));
  params.set("limit", String(limit));
  
  url.search = params.toString();
  const nextLink = url.toString();
  return nextLink;
};
