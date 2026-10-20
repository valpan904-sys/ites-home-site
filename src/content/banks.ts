/**
 * Банки-партнёры по финансированию отделки. Логотипы локальные.
 */
import bankMts from "@assets/bank-mts_1774953840833.png";
import bankAlfa from "@assets/bank-alfa_1774953840831.png";
import bankSovkom from "@assets/bank-sovkom_1774953840834.png";
import bankRenaissance from "@assets/bank-renaissance_1774953840833.png";
import bankRusstandart from "@assets/bank-russtandart_1774953840834.png";
import bankKreditEuropa from "@assets/bank-kredit-europa_1774953840832.png";
import bankTbank from "@assets/bank-tbank_1774953840834.png";
import bankOtp from "@assets/bank-otp_1774953840833.png";
import bankMig from "@assets/bank-mig_1774953840833.png";

export type Bank = { src: string; alt: string };

export const BANKS: Bank[] = [
  { src: bankMts, alt: "МТС Банк" },
  { src: bankAlfa, alt: "Альфа-Банк" },
  { src: bankSovkom, alt: "Совкомбанк" },
  { src: bankRenaissance, alt: "Ренессанс Банк" },
  { src: bankRusstandart, alt: "Русский Стандарт" },
  { src: bankKreditEuropa, alt: "КредитЕвропаБанк" },
  { src: bankTbank, alt: "Т-Банк" },
  { src: bankOtp, alt: "ОТП Банк" },
  { src: bankMig, alt: "МИГ Кредит" },
];
