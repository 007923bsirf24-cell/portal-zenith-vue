import { AppUser, Company } from './types';

/** Seed companies — derived from the user's brief */
export const SAMPLE_COMPANIES: Company[] = [
  { code: 'TMF_HO_OB',                    name: 'Head Office',                          city: 'Islamabad' },
  { code: 'DREAM_GARDEN',                 name: 'Dream Garden — Lahore',                city: 'Lahore' },
  { code: 'QUETTA_BOYS',                  name: 'Quetta Boys',                          city: 'Quetta' },
  { code: 'QUETTA_GIRLS',                 name: 'Quetta Girls',                         city: 'Quetta' },
  { code: 'QUETTA_JINNAH_TOWN',           name: 'Quetta Jinnah Town',                   city: 'Quetta' },
  { code: 'H8_GIRLS_ISLAMABAD',           name: 'H-8 Girls — Islamabad',                city: 'Islamabad' },
  { code: 'G10_PRE_JUNIOR_ISLAMABAD',     name: 'G-10 Pre-Junior — Islamabad',          city: 'Islamabad' },
  { code: 'F11_PRE_JUNIOR_ISLAMABAD',     name: 'F-11 Pre-Junior — Islamabad',          city: 'Islamabad' },
  { code: 'CHAKSHAHZAD_BOYS',             name: 'Chakshahzad Boys',                     city: 'Islamabad' },
  { code: 'TOWN_BRANCH_PESHAWAR',         name: 'Town Branch — Peshawar',               city: 'Peshawar' },
  { code: 'HAYATABAD_PESHAWAR',           name: 'Hayatabad — Peshawar',                 city: 'Peshawar' },
  { code: 'SATELLITE_TOWN_RAWALPINDI',    name: 'Satellite Town — Rawalpindi',          city: 'Rawalpindi' },
  { code: 'LAHORE_BOYS_JUNIOR',           name: 'Lahore Boys & Junior',                 city: 'Lahore' },
  { code: 'LAHORE_GIRLS',                 name: 'Lahore Girls',                         city: 'Lahore' },
  { code: 'ISLAMPURA_LAHORE',             name: 'Islampura — Lahore',                   city: 'Lahore' },
  { code: 'KHAYABAN_E_AMEEN',             name: 'Khayaban-e-Ameen',                     city: 'Lahore' },
  { code: 'ALI_CHOWK_MULTAN',             name: 'Ali Chowk — Multan',                   city: 'Multan' },
  { code: 'SHALIMAR_MULTAN',              name: 'Shalimar — Multan',                    city: 'Multan' },
  { code: 'MULTAN_MODEL_TOWN',            name: 'Multan Model Town',                    city: 'Multan' },
  { code: 'JAMSHORO',                     name: 'Jamshoro',                             city: 'Jamshoro' },
  { code: 'HYDERABAD',                    name: 'Hyderabad',                            city: 'Hyderabad' },
  { code: 'GULISTAN_E_JOHAR_BOYS',        name: 'Gulistan-e-Johar Boys',                city: 'Karachi' },
  { code: 'GULSHAN_E_IQBAL_GIRLS',        name: 'Gulshan-e-Iqbal Girls',                city: 'Karachi' },
  { code: 'CLIFTON_BOYS_KARACHI',         name: 'Clifton Boys — Karachi',               city: 'Karachi' },
  { code: 'KHAIRPUR',                     name: 'Khairpur',                             city: 'Khairpur' },
].map((c, i) => ({
  id: `co-${i + 1}`,
  ...c,
  active: true,
  createdAt: new Date().toISOString(),
}));

const now = new Date().toISOString();

export const SAMPLE_USERS: AppUser[] = [
  {
    id: 'u-1', fullName: 'System Administrator', username: 'admin', password: 'admin123',
    role: 'super_admin', companies: '*', active: true, createdAt: now, lastLoginAt: null,
  },
  {
    id: 'u-2', fullName: 'Chief Executive Officer', username: 'ceo', password: 'ceo123',
    role: 'ceo', companies: '*', active: true, createdAt: now, lastLoginAt: null,
  },
  {
    id: 'u-3', fullName: 'Chief Financial Officer', username: 'cfo', password: 'cfo123',
    role: 'cfo', companies: '*', active: true, createdAt: now, lastLoginAt: null,
  },
  {
    id: 'u-4', fullName: 'Finance Director', username: 'finance_director', password: 'finance123',
    role: 'finance_director', companies: '*', active: true, createdAt: now, lastLoginAt: null,
  },
  {
    id: 'u-5', fullName: 'Accountant — Quetta Boys', username: 'acc_quetta', password: 'acc123',
    role: 'accountant', companies: ['QUETTA_BOYS'], active: true, createdAt: now, lastLoginAt: null,
  },
  {
    id: 'u-6', fullName: 'Accountant — Dream Garden', username: 'acc_dream', password: 'acc123',
    role: 'accountant', companies: ['DREAM_GARDEN'], active: true, createdAt: now, lastLoginAt: null,
  },
  {
    id: 'u-7', fullName: 'Principal — Lahore Girls', username: 'principal_lahore', password: 'principal123',
    role: 'principal', companies: ['LAHORE_GIRLS'], active: true, createdAt: now, lastLoginAt: null,
  },
  {
    id: 'u-8', fullName: 'Regional Manager', username: 'manager', password: 'manager123',
    role: 'manager',
    companies: ['LAHORE_GIRLS', 'LAHORE_BOYS_JUNIOR', 'ISLAMPURA_LAHORE', 'DREAM_GARDEN', 'KHAYABAN_E_AMEEN'],
    active: true, createdAt: now, lastLoginAt: null,
  },
];
