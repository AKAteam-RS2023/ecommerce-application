export class Country {
  public static Poland = 'Poland';

  public static Lithuania = 'Lithuania';

  private static polandCode = 'PL';

  private static lithuaniaCode = 'LT';

  public static getCountryCode(countryName: string): string {
    if (countryName.toLowerCase() === Country.Poland.toLowerCase()) {
      return Country.polandCode;
    }

    return Country.lithuaniaCode;
  }

  public static getCountryName(code: string): string {
    if (code.toLowerCase() === Country.polandCode.toLowerCase()) {
      return Country.Poland;
    }

    return Country.Lithuania;
  }
}
