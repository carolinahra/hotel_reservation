export function isValidId(id): boolean {
  return id && typeof id === "number";
}

export function isValidName(name): boolean {
  const nameRegex = /^[A-Za-z\s]{2,}$/;
  return nameRegex.test(name);
}
export function isValidEmail(email): boolean {
  const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
  return emailRegex.test(email);
}

export function isValidLimit(limit): boolean {
  const limitRegex = /^\d+$/;
  return limitRegex.test(limit.toString());
}

export function isValidOffset(offset): boolean {
  const offsetRegex = /^\d+$/;
  return offsetRegex.test(offset.toString());
}

export function isValidString(string): boolean {
  const descriptionRegex = /^[A-Za-z]{2,}$/;
  return descriptionRegex.test(String(string));
}

export function isValidNumber(limit): boolean {
  const numberRegex = /^d+$/;
  return numberRegex.test(limit.toString());
}
export function isValidState(state): boolean {
  const stateRegex = /^[A-Za-z]{2,}$/;
  return stateRegex.test(state);
}

export function isValidPhone(phone): boolean {
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;
  return phoneRegex.test(phone);
}

export function isValidPrice(price): boolean {
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  return priceRegex.test(price);
}

export function isValidDate(date): boolean {
  const strictDateRegex =
    /^(?:(?:19|20)\d{2})-(?:(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01]))|(?:(?:0[469]|11)-(?:0[1-9]|[12]\d|30))|(?:02-(?:0[1-9]|1\d|2[0-8]))|(?:02-29(?=(?:(?:19|20)(?:0[48]|[2468][048]|[13579][26])))))$/;
  return strictDateRegex.test(date);
}

export function isValidExternalReference(externalReference): boolean {
  const uuidV7Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV7Regex.test(externalReference);
}
