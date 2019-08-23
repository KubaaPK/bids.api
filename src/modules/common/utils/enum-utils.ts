export class EnumUtils {
  public static printEnumValues(param: any): string[] {
    const values: string[] = [];
    for (const value in param) {
      values.push(` ${param[value]}`);
    }
    return values;
  }
}
