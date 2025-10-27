import { ValueObject } from "@shared/value-object";
interface ExtraServiceProps {
  id: number;
  name: string;
  price: number;
}

export class ExtraService extends ValueObject<ExtraServiceProps> {
  public get id() {
    return this.props.id;
  }
  public get name() {
    return this.props.name;
  }
  public get price() {
    return this.props.price;
  }
  public toPrimitives() {
    return {
      id: this.props.id,
      name: this.props.name,
      price: this.props.price,
    };
  }
}
