const ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateRandomString = (length = 8) => {
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += ALPHABET.charAt(
      Math.floor(Math.random() * ALPHABET.length)
    );
  }
  return randomString;
};

export default generateRandomString;
