const lowerAlphaPool = "abcdefghijklmnopqrstuvwxyz";
const upperAlphaPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const idPool = lowerAlphaPool + upperAlphaPool;

// This random IS NOT cryptographically secure, and does not need to be.
export const newRandomID = (length: number): string => {
  let id = "";

  for (let i = 0; i < length; i++) {
    const randomNum = Math.floor(Math.random() * idPool.length);
    id += idPool[randomNum];
  }

  return id;
};
