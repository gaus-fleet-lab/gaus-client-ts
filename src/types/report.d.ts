type GausReportData = {
  v_strings: { [key: string]: string };
  v_ints: { [key: string]: number };
  type: string;
  v_floats: { [key: string]: number };
  tags: { [key: string]: string };
  ts: string;
};
type GausReportHeader = { seqNo: number; ts: string; tags: { [key: string]: string } };
type GausReportVersion = string;
type GausReport = { data: GausReportData; header: GausReportHeader; version: GausReportVersion };
