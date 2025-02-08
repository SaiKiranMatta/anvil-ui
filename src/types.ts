export interface Parameter {
    name: string;
    type: string;
    placeholder: string;
  }
  
  export interface Method {
    name: string;
    method: (...args: any[]) => Promise<any>;
    params?: Parameter[];
    description?: string;
  }
  
  export interface MethodConfig {
    [key: string]: Method;
  }
  
  export interface MethodCategory {
    title: string;
    methods: MethodConfig;
  }
  
  export interface MethodOption {
    value: string;
    label: string;
  }
  
  export interface Card {
    id: string;
    methodName: string | null;
  }
  
  export interface MethodCardProps {
    id: string;
    card: Card;
    methodOptions: MethodOption[];
    onRemove: () => void;
    onMethodSelect: (methodName: string) => void;
    allMethods: MethodConfig;
  }