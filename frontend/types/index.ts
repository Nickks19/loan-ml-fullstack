export type PredictRequest = {
  loan_amnt: number;
  term: string;
  annual_inc: number;
  fico_range_low: number;
  dti: number;
};

export type PredictResponse = {
  result: "Approved" | "Rejected";
  probability: number;
  probability_bad: number;
};

export type DTIRequest = {
  annual_inc: number;
  monthly_debt_payment: number;
};

export type DTIResponse = {
  dti: number;
};