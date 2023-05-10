const WEEK_LIST = [
  {
    label: "Minggu ke 1",
    value: 1,
  },
  {
    label: "Minggu ke 2",
    value: 2,
  },
  {
    label: "Minggu ke 3",
    value: 3,
  },
  {
    label: "Minggu ke 4",
    value: 4,
  },
];

const MONTH_LIST = [
  {
    label: "Januari",
    value: 1,
  },
  {
    label: "Februari",
    value: 2,
  },
  {
    label: "Maret",
    value: 3,
  },
  {
    label: "April",
    value: 4,
  },
  {
    label: "Mei",
    value: 5,
  },
  {
    label: "Juni",
    value: 6,
  },
  {
    label: "Juli",
    value: 7,
  },
  {
    label: "Agustus",
    value: 8,
  },
  {
    label: "September",
    value: 9,
  },
  {
    label: "Oktober",
    value: 10,
  },
  {
    label: "November",
    value: 11,
  },
  {
    label: "Desember",
    value: 12,
  },
];

const STAGE_PROJECT = [
  {
    label: "Persiapan Lahan",
    value: "LAND_PREP",
  },
  {
    label: "Pasang Pondasi",
    value: "FOUNDATION",
  },
  {
    label: "Struktur",
    value: "FORMWORK",
  },
  {
    label: "Finishing",
    value: "FINISHING",
  },
];

const TYPE_PROJECT = [
  {
    label: "Infrastruktur",
    value: "INFRASTRUKTUR",
  },
  {
    label: "High-rise",
    value: "HIGH-RISE",
  },
  {
    label: "Rumah",
    value: "RUMAH",
  },
  {
    label: "Komersial",
    value: "KOMERSIAL",
  },
  {
    label: "Industrial",
    value: "INDUSTRIAL",
  },
];

const VEHICLE_LIST = [
  {
    label: "B 5236 TOB",
    value: "B5236TOB",
  },
  {
    label: "B 6589 TWS",
    value: "B6589TWS",
  },
  {
    label: "B 1237 AB",
    value: "B1237AB",
  },
];

const PO_METHOD_LIST = [
  {
    label: "Pompa",
    value: "pompa",
  },
  {
    label: "Non-Pompa",
    value: "non-pompa",
  },
];

const METHOD_LIST = [
  {
    label: "Rigid",
    value: "Rigid",
  },
  {
    label: "Manual",
    value: "Manual",
  },
  {
    label: "Concrete Pump",
    value: "Concrete Pump",
  },
];

const METHOD_LIST_DEPRECATED = [
  {
    label: "Pompa",
    value: true,
  },
  {
    label: "Non-Pompa",
    value: false,
  },
];

const DRIVER_LIST = [
  {
    label: "Bejo",
    value: "BEJO",
  },
  {
    label: "Udin",
    value: "UDIN",
  },
  {
    label: "Samsul",
    value: "SAMSUL",
  },
];

const TM_CONDITION = [
  {
    label: "Terisi Air",
    value: "WATER",
  },
  {
    label: "Kosong Bersih",
    value: "CLEAN",
  },
  {
    label: "Beton Rusak",
    value: "BROKEN_CONCRETE",
  },
];

export {
  MONTH_LIST,
  WEEK_LIST,
  STAGE_PROJECT,
  TYPE_PROJECT,
  VEHICLE_LIST,
  DRIVER_LIST,
  TM_CONDITION,
  PO_METHOD_LIST,
  METHOD_LIST,
  METHOD_LIST_DEPRECATED,
};
