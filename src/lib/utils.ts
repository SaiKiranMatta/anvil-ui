import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert decimal to hex string with '0x' prefix
export function toHex(num: number | string): string {
  const decimalNum = typeof num === 'string' ? parseInt(num) : num;
  return '0x' + decimalNum.toString(16);
}

// Convert hex string to decimal
export function fromHex(hex: string): number {
  return parseInt(hex, 16);
}

// Convert ETH to Wei (as hex string)
export function ethToWeiHex(eth: string): string {
  const wei = parseFloat(eth) * 1e18;
  return toHex(Math.floor(wei));
}

// Convert Wei (hex) to ETH
export function weiHexToEth(weiHex: string): string {
  const wei = fromHex(weiHex);
  return (wei / 1e18).toString();
}

// Format large numbers with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}