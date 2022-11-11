export default function checkProperties(obj) {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === "" || obj[key] === undefined)
      delete obj[key];
    return true;
  }
  return false;
}
