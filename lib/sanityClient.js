import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: "t1mpo144",
  dataset: "production",
  apiVersion: "2022-08-23",
  token:
    "skJNOjKg5ynUaTz2JmdeLLeWB6ESBdM8UkXMEAxGbkTa561xjVqNUEk3R7VDiyN0Jsdvf9Cz61eRvPGaYO2tZwqWHfWh9e2RFIYLy5qI4Oe64BPuDCo4dfZNu909rhrFMIkXZeMJV0FdHpL97KHN33j4zdTRvs0sThq6qmLPC508r7NAWvxR",
  useCdn: false,
});
