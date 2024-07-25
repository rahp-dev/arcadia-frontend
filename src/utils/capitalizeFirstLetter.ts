export function capitalizeFirstLetter(string: string): string {
  if (typeof string !== 'string' || string.length === 0) {
    return ''
  }

  return string
    .split(' ') // Separamos la cadena en palabras por espacios
    .map((word) => {
      // Si la palabra tiene más de una palabra en mayúscula, solo capitalizamos la primera letra de cada una
      if (word.match(/[A-Z]{2,}/)) {
        return word
          .split(' ')
          .map(
            (subword) =>
              subword.charAt(0).toUpperCase() + subword.slice(1).toLowerCase(),
          )
          .join(' ')
      } else {
        // Si solo tiene una palabra, capitalizamos solo la primera letra
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }
    })
    .join(' ')
}
