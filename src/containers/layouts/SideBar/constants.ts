import type { MenuItemProps } from './components/SidebarMenuItem';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import SwapVerticalCircleOutlinedIcon from '@mui/icons-material/SwapVerticalCircleOutlined';
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined';
import { ViewPermissions } from '@enums';
import { ROUTES } from '@constants/global/route';
import { EditNoteIcon, HDPrescriptionIcon } from '@assets/icons';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import { DialyzerIcon } from '@assets/icons/DialyzerIcon';

export const patientMenuItems: MenuItemProps[] = [
  { title: 'sidebar.profile', path: ROUTES.patientProfile, icon: PersonOutlineOutlinedIcon },
  {
    title: 'sidebar.clinicalNotes',
    path: ROUTES.patientClinicalNotes,
    icon: EditNoteIcon,
    viewPermissions: [ViewPermissions.ViewClinicalNotes],
  },
  { title: 'sidebar.prescription', path: ROUTES.patientHdPrescription, icon: HDPrescriptionIcon },
  {
    title: 'sidebar.dialyzer',
    path: ROUTES.patientDialyzer,
    icon: DialyzerIcon,
    viewPermissions: [ViewPermissions.ViewDialyzer],
  },
  {
    title: 'sidebar.medications',
    path: ROUTES.patientMedication,
    icon: MedicationOutlinedIcon,
    viewPermissions: [ViewPermissions.MedicationView],
  },
  {
    title: 'sidebar.vaccination',
    path: ROUTES.patientVaccination,
    icon: VaccinesOutlinedIcon,
    viewPermissions: [ViewPermissions.ViewVaccination],
  },
  {
    title: 'sidebar.virology',
    path: ROUTES.patientVirology,
    icon: CoronavirusOutlinedIcon,
    viewPermissions: [ViewPermissions.ViewVirology],
  },
  {
    title: 'sidebar.labResults',
    path: ROUTES.patientLabResults,
    icon: ScienceOutlinedIcon,
    viewPermissions: [ViewPermissions.PatientViewAnalyses],
  },
  {
    title: 'sidebar.accessManagement',
    path: ROUTES.accessManagement,
    icon: SwapVerticalCircleOutlinedIcon,
    viewPermissions: [ViewPermissions.PatientViewAccess],
  },
];

export const staffMenuItems: MenuItemProps[] = [
  {
    title: 'sidebar.profile',
    path: ROUTES.staffProfile,
    icon: PersonOutlineOutlinedIcon,
    basePath: `${ROUTES.administration}/${ROUTES.staffManagement}`,
    viewPermissions: [ViewPermissions.StaffView],
  },
];

export const dialysisMachineMenuItems: MenuItemProps[] = [
  {
    title: 'sidebar.information',
    basePath: `${ROUTES.administration}/${ROUTES.dialysisMachines}`,
    path: ROUTES.dialysisMachineInformation,
    icon: SettingsApplicationsOutlinedIcon,
    viewPermissions: [],
  },
];
