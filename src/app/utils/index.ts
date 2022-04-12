
export const obtainNonWhatsAppPhoneNumber = (
  firstNumber: string,
  firstIsWhatsApp: string,
  secondNumber: string,
  secondIsWhatsApp: string) => {
    if (firstIsWhatsApp === 'No') {
      return firstNumber;
    }

    if (secondIsWhatsApp === 'No') {
      return secondNumber;
    }

    return firstNumber;
  }

