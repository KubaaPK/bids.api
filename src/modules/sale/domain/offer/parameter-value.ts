export class ParameterValue {
  public name: string;
  public value: any;

  public static create(name: string, value: string): ParameterValue {
    const parameterValue: ParameterValue = new ParameterValue();
    parameterValue.name = name;
    parameterValue.value = value;

    return parameterValue;
  }
}
