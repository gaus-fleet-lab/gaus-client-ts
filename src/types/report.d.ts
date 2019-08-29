type GausReportVersion = string;
type DateString = string;

interface GausReportData {
  v_strings?: { [key: string]: string };
  v_ints?: { [key: string]: number };
  type: string;
  v_floats?: { [key: string]: number };
  tags?: { [key: string]: string };
  ts: DateString;
}
interface GausReportHeader {
  seqNo?: number;
  ts: DateString;
  tags?: { [key: string]: string };
}
interface GausReport {
  data: GausReportData[];
  header: GausReportHeader;
  version: GausReportVersion;
}
